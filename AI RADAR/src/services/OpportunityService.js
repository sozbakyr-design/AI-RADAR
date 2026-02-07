
import { getClient } from '../supabase/client.js';
import { OPPORTUNITIES } from '../config/constants.js'; // Fallback / Seed Source

export const OpportunityService = {

    // Fetch all opportunities (Supabase -> Mock Fallback)
    async getAll() {
        const supabase = getClient();
        if (!supabase) return OPPORTUNITIES; // Mock Mode

        try {
            // timeout promise
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), 5000)
            );

            const fetch = supabase
                .from('opportunities')
                .select('*')
                .eq('is_published', true)
                .order('trend_score', { ascending: false });

            // Race: Fetch vs 5s Timeout
            const { data, error } = await Promise.race([fetch, timeout]);

            if (error) {
                console.error('Supabase Error:', error);
                return OPPORTUNITIES;
            }

            if (!data || data.length === 0) {
                console.warn('DB Empty. Using Fallback.');
                return OPPORTUNITIES;
            }

            // Map DB fields to camelCase
            return data.map(item => this.mapToFrontend(item));

        } catch (err) {
            console.error('Fetch Failed:', err);
            return OPPORTUNITIES; // Fallback on crash/timeout
        }
    },

    // Get Single by ID
    async getById(id) {
        const supabase = getClient();
        if (!supabase) return OPPORTUNITIES.find(o => o.id === id);

        const { data, error } = await supabase
            .from('opportunities')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return OPPORTUNITIES.find(o => o.id === id);

        return this.mapToFrontend(data);
    },

    // Seed Data (Admin Param)
    async seedData() {
        const supabase = getClient();
        if (!supabase) return alert('Supabase not connected!');

        const payload = OPPORTUNITIES.map(o => ({
            // ID: Let DB generate or use existing if UUID (mock IDs are '1', '2' -> need UUIDs for DB usually, but let's try to insert)
            // Ideally, we drop ID and let DB generate new UUIDs
            title: o.title,
            description: o.description,
            type: o.type, // Required
            category: o.category,
            difficulty: o.difficulty,
            revenue_potential: o.revenuePotential,
            time_to_start: o.timeToStart,
            audience: o.audience,
            trend_score: o.trendScore,
            ai_insights: o.aiInsights,
            story: o.story,
            real_world: o.realWorld,
            tools: o.tools,
            steps: o.steps,
            social_proof: o.socialProof
        }));

        const { data, error } = await supabase
            .from('opportunities')
            .insert(payload)
            .select();

        if (error) {
            console.error('Seed Error Full:', error);
            return { success: false, message: error.message || JSON.stringify(error) };
        } else {
            console.log('Seed Success:', data);
            return { success: true, message: `${data ? data.length : 0} veri başarıyla eklendi!` };
        }
    },

    // Helper: Map DB snake_case to Frontend camelCase
    mapToFrontend(dbItem) {
        return {
            id: dbItem.id,
            title: dbItem.title,
            description: dbItem.description,
            category: dbItem.category,
            difficulty: dbItem.difficulty,
            revenuePotential: dbItem.revenue_potential,
            timeToStart: dbItem.time_to_start,
            audience: dbItem.audience,
            trendScore: dbItem.trend_score,
            aiInsights: dbItem.ai_insights,
            story: dbItem.story,
            realWorld: dbItem.real_world,
            tools: dbItem.tools,
            steps: dbItem.steps,
            socialProof: dbItem.social_proof,
            type: dbItem.type
            // ... add others as needed
        };
    }
};
