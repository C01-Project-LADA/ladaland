'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Auth.module.css';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import '@/envConfig.ts'

const registerSchema = z
  .object({
    username: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

const loginSchema = z.object({
  usernameOrEmail: z.string().nonempty(),
  password: z.string().min(8),
});

const exampleUsernames = [
  'thebesttraveller',
  'ladalandnumberone',
  'travelguru',
  'wanderlust',
  'alwaysexploring',
  'travelbug',
  'adventureseeker',
  'globetrotter',
  'traveladdict',
];

const url = process.env.API_URL;

// This component renders a GET STARTED button in the navbar that opens a form to sign up or log in
export default function Auth() {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [exampleUsername, setExampleUsername] = useState('thebesttraveller');
  const [loading, setLoading] = useState(false);

  // Display new example username when opening form
  useEffect(() => {
    if (formOpen) {
      setExampleUsername(
        exampleUsernames[Math.floor(Math.random() * exampleUsernames.length)]
      );
    }
  }, [formOpen]);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: '',
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      console.log(url);
      console.log(process.env.API_URL)
      const response = await axios.post(`${url}/register`, values, {
        withCredentials: true,
      });

      if (response.status === 201) {
        router.push('/');
      }
    } catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || 'An unexpected error occurred';
        registerForm.setError('confirm', { message: errorMessage });
      } else {
        registerForm.setError('confirm', {
          message: 'An unexpected error occurred. Please try again later.',
        });
      }
    }
  }

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/login`, values, {
        withCredentials: true,
      });

      if (response.status === 200) {
        router.push('/');
      }
    } catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || 'An unexpected error occurred';
        loginForm.setError('password', { message: errorMessage });
      } else {
        loginForm.setError('password', {
          message: 'An unexpected error occurred. Please try again later.',
        });
      }
    }
  }

  function handleClose() {
    setFormOpen(false);
    setShowPassword(false);
    setShowConfirm(false);
  }

  function handleSwitchForm() {
    setIsSignUp((prev) => !prev);
    registerForm.reset();
    loginForm.reset();
    setShowPassword(false);
    setShowConfirm(false);
  }

  return (
    <>
      {/* Used to open form from other components */}
      <div
        style={{
          display: 'none',
        }}
        onClick={() => {
          setIsSignUp(true);
          setFormOpen(true);
        }}
        id="get-started"
      />

      <Button
        style={{
          fontWeight: 'bold',
          paddingLeft: 25,
          paddingRight: 25,
          color: 'var(--lada-accent)',
        }}
        variant="outline"
        onClick={() => {
          setIsSignUp(false);
          setFormOpen(true);
        }}
        id="log-in"
      >
        LOG IN
      </Button>

      <AnimatePresence mode="wait">
        {formOpen && (
          <motion.div
            className={styles.container}
            initial={{ y: 50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.3, ease: 'easeInOut' },
            }}
            exit={{
              y: 50,
              opacity: 0,
              transition: { duration: 0.3, ease: 'easeInOut' },
            }}
          >
            <div className={styles.header}>
              <Button
                variant="ghost"
                size="icon"
                elevated={false}
                onClick={handleClose}
              >
                <X />
              </Button>

              <div style={{ paddingRight: '20px' }}>
                <Button
                  variant="outline"
                  style={{
                    borderWidth: 2,
                    color: 'var(--lada-accent)',
                    fontWeight: 800,
                  }}
                  onClick={handleSwitchForm}
                  disabled={loading}
                >
                  {isSignUp ? 'LOG IN' : 'SIGN UP'}
                </Button>
              </div>
            </div>

            {isSignUp ? (
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className={styles.form_container}
                  key={1}
                >
                  <h2 className={styles.form_title}>Sign Up</h2>
                  <h3 className={styles.form_subtitle}>
                    Become a lada land user to start gamifying your travel!
                  </h3>
                  <div style={{ marginBottom: 10 }}>
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder={exampleUsername} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="user@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex w-full items-center space-x-2">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                {...field}
                              />
                              <Button
                                type="button"
                                size="icon"
                                elevated={false}
                                variant="ghost"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div style={{ marginBottom: 30 }}>
                    <FormField
                      control={registerForm.control}
                      name="confirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="flex w-full items-center space-x-2">
                              <Input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                {...field}
                              />
                              <Button
                                type="button"
                                size="icon"
                                elevated={false}
                                variant="ghost"
                                onClick={() => setShowConfirm((prev) => !prev)}
                              >
                                {showConfirm ? <EyeOff /> : <Eye />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    style={{ width: '100%', fontWeight: 'bold' }}
                    disabled={loading}
                  >
                    SIGN UP
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className={styles.form_container}
                  key={2}
                >
                  <h2 className={styles.form_title}>Log In</h2>
                  <h3 className={styles.form_subtitle}>
                    Welcome back! Log in to continue your journey.
                  </h3>
                  <div style={{ marginBottom: 10 }}>
                    <FormField
                      control={loginForm.control}
                      name="usernameOrEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username or Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Username or Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div style={{ marginBottom: 30 }}>
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex w-full items-center space-x-2">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                {...field}
                              />
                              <Button
                                type="button"
                                size="icon"
                                elevated={false}
                                variant="ghost"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    style={{ width: '100%', fontWeight: 'bold' }}
                    disabled={loading}
                  >
                    LOG IN
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
