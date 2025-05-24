# Video Transcriber

A full-stack application that transcribes videos in English using OpenAI's Whisper model. Supports various video formats including MP4, MOV, AVI, MKV, and WMV.

## Features

- Modern web interface with drag-and-drop video upload
- Support for multiple video formats
- Real-time transcription using OpenAI's Whisper model
- Fast and responsive UI built with React and Material-UI

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- FFmpeg installed on your system

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd video-transcriber
```

2. Set up the backend:
```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
# From the root directory
cd backend
python main.py
```

2. Start the frontend development server:
```bash
# In a new terminal, from the frontend directory
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Drag and drop a video file onto the upload area or click to select a file
2. Wait for the transcription to complete
3. View the transcribed text below the upload area

## Supported Video Formats

- MP4 (.mp4)
- MOV (.mov)
- AVI (.avi)
- MKV (.mkv)
- WMV (.wmv)

## Notes

- The first time you run the application, it will download the Whisper model which may take a few minutes depending on your internet connection.
- For best results, use videos with clear audio in English.
- The transcription quality depends on the audio quality of the input video. 