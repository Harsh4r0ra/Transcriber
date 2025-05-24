import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Button,
  IconButton,
  TextField,
  LinearProgress
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setLoading(true);
    setError('');
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      setTranscription(response.data.text);
    } catch (err) {
      setError('Error transcribing video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.wmv']
    },
    multiple: false
  });

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    element.click();
  };

  const reset = () => {
    setFile(null);
    setTranscription('');
    setError('');
    setProgress(0);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Video Transcriber
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            Convert your videos to text
          </Typography>

          {!file && !transcription && (
            <Paper
              {...getRootProps()}
              sx={{
                p: 6,
                mb: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                {isDragActive
                  ? 'Drop the video here...'
                  : 'Drag and drop a video file here, or click to select'}
              </Typography>
            </Paper>
          )}

          {file && !loading && !transcription && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </Typography>
                </Box>
                <IconButton onClick={reset} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Paper>
          )}

          {loading && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress />
                <Typography>Transcribing... {progress}%</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ width: '100%' }}
                />
              </Box>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          {transcription && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Transcript</Typography>
                <Button onClick={reset} size="small">
                  New file
                </Button>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={8}
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={copyText}
                  variant="outlined"
                >
                  Copy
                </Button>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={downloadText}
                  variant="contained"
                >
                  Download
                </Button>
              </Box>
            </Paper>
          )}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 'auto', pt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ by Harsh Arora
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default App; 