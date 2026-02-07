
import { getClient } from './client.js';

const supabase = getClient();

export const API = {
    // --- User Profile ---

    async getProfile(userId) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error fetching profile:', err);
            return null;
        }
    },

    async updateProfile(userId, updates) {
        if (!supabase) return null;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error updating profile:', err);
            return null;
        }
    },

    // --- Sync Helper (Local -> Cloud) ---
    async syncLocalProfile(user, localData) {
        if (!user || !supabase) return;

        // Get current remote
        const remote = await this.getProfile(user.id);

        // Logic: Remote wins if higher, otherwise update remote
        let needsUpdate = false;
        const updates = {};

        // XP Sync
        if (localData.xp > (remote?.xp || 0)) {
            updates.xp = localData.xp;
            needsUpdate = true;
        }

        // Streak Sync
        if (localData.streak > (remote?.streak || 0)) {
            updates.streak = localData.streak;
            needsUpdate = true;
        }

        if (needsUpdate) {
            await this.updateProfile(user.id, updates);
        }
    }
};
