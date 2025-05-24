from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import os
import tempfile
from pathlib import Path

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Whisper model
model = whisper.load_model("base")

@app.post("/transcribe")
async def transcribe_video(file: UploadFile = File(...)):
    # Create a temporary file to store the uploaded video
    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_file_path = temp_file.name

    try:
        # Transcribe the video
        result = model.transcribe(temp_file_path)
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        return {
            "text": result["text"],
            "segments": result["segments"]
        }
    except Exception as e:
        # Clean up the temporary file in case of error
        os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 