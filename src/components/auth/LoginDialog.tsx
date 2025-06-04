import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUserStore, useToastStore } from '../../lib/store';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'vibeCoder' | 'client'>('client');
  const [loading, setLoading] = useState(false);
  
  const setUser = useUserStore((state) => state.setUser);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          ...(isLogin ? {} : { name, role })
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const user = await response.json();
      setUser(user);
      onClose();
      
      addToast({
        title: isLogin ? 'Welcome back!' : 'Account created',
        description: isLogin ? 'Successfully signed in' : 'Your account has been created',
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Authentication Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        I am a...
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="client"
                            checked={role === 'client'}
                            onChange={(e) => setRole(e.target.value as 'client')}
                            className="mr-2"
                          />
                          Client
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="vibeCoder"
                            checked={role === 'vibeCoder'}
                            onChange={(e) => setRole(e.target.value as 'vibeCoder')}
                            className="mr-2"
                          />
                          Vibe Coder
                        </label>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={loading}
                    icon={isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      {isLogin
                        ? "Don't have an account? Sign up"
                        : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginDialog;