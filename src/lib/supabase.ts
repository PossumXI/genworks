import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'vibeCoder' | 'client' | 'hubContributor';
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  files: Record<string, string>;
  collaborators: string[];
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  result: string;
  user_id: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  likes: number;
  views: number;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_time: string;
  seller_id: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Database queries
export const queries = {
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    
    update: async (userId: string, updates: Partial<Profile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  },

  projects: {
    list: async (userId: string) => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or(`owner_id.eq.${userId},collaborators.cs.{${userId}}`)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },

    get: async (projectId: string) => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data as Project;
    },

    create: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      
      if (error) throw error;
      return data as Project;
    },

    update: async (projectId: string, updates: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Project;
    },

    delete: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
    }
  },

  prompts: {
    list: async (filters?: { userId?: string; tags?: string[] }) => {
      let query = supabase.from('prompts').select('*');

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.tags) {
        query = query.contains('tags', filters.tags);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Prompt[];
    },

    get: async (promptId: string) => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', promptId)
        .single();
      
      if (error) throw error;
      return data as Prompt;
    },

    create: async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'likes' | 'views'>) => {
      const { data, error } = await supabase
        .from('prompts')
        .insert(prompt)
        .select()
        .single();
      
      if (error) throw error;
      return data as Prompt;
    },

    update: async (promptId: string, updates: Partial<Prompt>) => {
      const { data, error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', promptId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Prompt;
    },

    delete: async (promptId: string) => {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);
      
      if (error) throw error;
    }
  },

  gigs: {
    list: async (filters?: { sellerId?: string; tags?: string[] }) => {
      let query = supabase.from('gigs').select('*');

      if (filters?.sellerId) {
        query = query.eq('seller_id', filters.sellerId);
      }

      if (filters?.tags) {
        query = query.contains('tags', filters.tags);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Gig[];
    },

    get: async (gigId: string) => {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', gigId)
        .single();
      
      if (error) throw error;
      return data as Gig;
    },

    create: async (gig: Omit<Gig, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('gigs')
        .insert(gig)
        .select()
        .single();
      
      if (error) throw error;
      return data as Gig;
    },

    update: async (gigId: string, updates: Partial<Gig>) => {
      const { data, error } = await supabase
        .from('gigs')
        .update(updates)
        .eq('id', gigId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Gig;
    },

    delete: async (gigId: string) => {
      const { error } = await supabase
        .from('gigs')
        .delete()
        .eq('id', gigId);
      
      if (error) throw error;
    }
  }
};

// Real-time subscriptions
export const subscriptions = {
  onProjectUpdate: (projectId: string, callback: (update: Project) => void) => {
    return supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        (payload) => callback(payload.new as Project)
      )
      .subscribe();
  },

  onPromptUpdate: (promptId: string, callback: (update: Prompt) => void) => {
    return supabase
      .channel(`prompt-${promptId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prompts',
          filter: `id=eq.${promptId}`
        },
        (payload) => callback(payload.new as Prompt)
      )
      .subscribe();
  }
};

export default supabase;