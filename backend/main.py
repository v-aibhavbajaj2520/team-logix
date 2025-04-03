import whisper

model = whisper.load_model("large-v3")  # Use the most powerful model
result = model.transcribe("video.mp4", language="en", fp16=False)  # Set language explicitly

with open("captions.srt", "w") as f:
    for i, segment in enumerate(result["segments"]):
        start = segment["start"]
        end = segment["end"]
        text = segment["text"]
        f.write(f"{i+1}\n{start:.2f} --> {end:.2f}\n{text}\n\n")
print("Captions saved as captions.srt")
