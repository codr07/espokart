import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Shield, User } from 'lucide-react';

type Profile = {
  gamertag: string | null;
  email: string;
};

export default function Account() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gamertag, setGamertag] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkAdminRole();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('gamertag, email')
      .eq('id', user.id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
      return;
    }

    setProfile(data);
    setGamertag(data.gamertag || '');
  };

  const checkAdminRole = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    setIsAdmin(!!data);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);

    const { error } = await supabase
      .from('profiles')
      .update({ gamertag })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      fetchProfile();
    }

    setUpdating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card p-8 border-2 border-neon-blue/30">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-display font-bold neon-text">
                Account Settings
              </h1>
              {isAdmin && (
                <div className="flex items-center gap-2 px-3 py-1 bg-neon-magenta/20 border border-neon-magenta/50 rounded-lg">
                  <Shield className="w-4 h-4 text-neon-magenta" />
                  <span className="text-sm text-neon-magenta font-semibold">Admin</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-neon-blue/20">
                <User className="w-5 h-5 text-neon-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>

              <form onSubmit={updateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gamertag">Gamertag</Label>
                  <Input
                    id="gamertag"
                    type="text"
                    placeholder="Enter your gamertag"
                    value={gamertag}
                    onChange={(e) => setGamertag(e.target.value)}
                    className="bg-background/50 border-neon-blue/30"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={updating}
                  className="w-full"
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>

              <div className="pt-6 border-t border-neon-blue/20">
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
