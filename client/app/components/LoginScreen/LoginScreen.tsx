'use client';

import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { darkRedTheme } from '@/theme';
import { ThemeProvider, CssBaseline } from '@mui/material';
import styles from './LoginScreen.module.scss';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface LoginScreenProps {
  username: string;
  setUsername: (name: string) => void;
  onJoin: () => void;
}

export default function LoginScreen({ username, setUsername, onJoin }: LoginScreenProps) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const title = "Next Talk";

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // réinitialiser l'erreur

    if (!username.trim()) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, avatarUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        onJoin(); 
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
    }
  };

  return (
    <ThemeProvider theme={darkRedTheme}>
      <CssBaseline />
      <div className={styles.loginContainer}>
        <Paper className={styles.loginBox} elevation={0}>
          <div className={styles.logoContainer}>
            <Image src="/favicon.ico" alt="NextTalk logo" className={styles.logo} width={64} height={64} />

            <Typography variant="h1" component="h1" className={styles.title}>
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
            </Typography>

            <Typography className={styles.subtitle}>
              Connectez-vous instantanément et discutez en temps réel avec votre équipe
            </Typography>
          </div>

          <Box component="form" onSubmit={handleJoin} className={styles.formSection}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              inputProps={{ maxLength: 20 }}
              sx={{ mb: 2 }}
              error={!!error}
              helperText={error || ''}
            />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="URL avatar (optionnel)"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!username.trim()}
            >
              Rejoindre la conversation
            </Button>
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
}
