import { useEffect, useRef, useState } from "react";
import "./ProblemSolver.css";
import AnalysisResult from "./AnalysisResult";

function ProblemSolver({ language = "en", darkMode = false }) {
  const [problem, setProblem] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🎤 Voice states
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Prevent unnecessary repeated translation
  const lastTranslatedLanguage = useRef(language);

  const isHindi = language === "hi";

  // =====================================================
  // TEXT
  // =====================================================

  const t = {
    badge: isHindi
      ? "✨ AI-powered घरेलू सहायक"
      : "✨ AI-powered household assistant",

    hero1: isHindi
      ? "घरेलू समस्याएं"
      : "Solve household",

    hero2: isHindi
      ? "समझदारी से हल करें।"
      : "problems smarter.",

    description: isHindi
      ? "अपनी समस्या बताएं, फोटो अपलोड करें और GharKaAI की मदद से समझें कि क्या गलत है और आगे क्या करना चाहिए।"
      : "Describe a problem, upload a photo, and let GharKaAI help you understand what is wrong and what to do next.",

    solve: isHindi
      ? "समस्या हल करें →"
      : "Solve a Problem →",

    seeHow: isHindi
      ? "कैसे काम करता है"
      : "See how it works",

    yourProblem: isHindi
      ? "आपकी समस्या"
      : "YOUR PROBLEM",

    happening: isHindi
      ? "क्या समस्या हो रही है?"
      : "What's happening?",

    placeholder: isHindi
      ? "अपनी समस्या यहां लिखें या 🎤 बोलकर बताएं..."
      : "Write your problem here or 🎤 speak...",

    hint: isHindi
      ? "अपनी समस्या लिखें या माइक्रोफोन दबाकर बोलें।"
      : "Describe your problem or use the microphone to speak.",

    upload: isHindi
      ? "फोटो अपलोड करें"
      : "Upload a photo",

    uploadHint: isHindi
      ? "AI को समस्या बेहतर समझने में मदद करें"
      : "Help AI understand the problem better",

    selected: isHindi
      ? "फोटो सफलतापूर्वक चुनी गई"
      : "Photo selected successfully",

    remove: isHindi
      ? "हटाएं"
      : "Remove",

    analyzing: isHindi
      ? "विश्लेषण हो रहा है... ✨"
      : "Analyzing... ✨",

    analyze: isHindi
      ? "समस्या का विश्लेषण करें ✨"
      : "Analyze Problem ✨",

    listening: isHindi
      ? "सुन रहा हूं... बोलिए"
      : "Listening... speak now",

    micStart: isHindi
      ? "बोलकर बताएं"
      : "Speak your problem",

    micStop: isHindi
      ? "रिकॉर्डिंग बंद करें"
      : "Stop listening",
  };

  // =====================================================
  // 🔄 AUTO TRANSLATE EXISTING RESULT
  // =====================================================

  useEffect(() => {
    const translateExistingAnalysis = async () => {
      // No result yet
      if (!showResult || !analysis) {
        return;
      }

      // Already translated to this language
      if (lastTranslatedLanguage.current === language) {
        return;
      }

      try {
        setLoading(true);

        console.log(
          `Translating existing analysis to ${
            language === "hi" ? "Hindi" : "English"
          }...`
        );

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/translate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              analysis: analysis,
              language: language,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.details ||
              data.error ||
              "Translation failed."
          );
        }

        if (data.analysis) {
          setAnalysis(data.analysis);
          lastTranslatedLanguage.current = language;
        }

      } catch (error) {
        console.error(
          "TRANSLATION ERROR:",
          error
        );


      } finally {
        setLoading(false);
      }
    };

    translateExistingAnalysis();

  }, [language, showResult]);

  // =====================================================
  // 🎤 VOICE / SPEECH TO TEXT
  // =====================================================

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isHindi
          ? "आपका browser voice input support नहीं करता। कृपया Google Chrome इस्तेमाल करें।"
          : "Your browser does not support voice input. Please use Google Chrome."
      );

      return;
    }

    // Stop listening
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = isHindi
      ? "hi-IN"
      : "en-IN";

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        }
      }

      if (finalText) {
        setProblem((prev) =>
          prev
            ? `${prev} ${finalText.trim()}`
            : finalText.trim()
        );
      }

      setShowResult(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "VOICE ERROR:",
        event.error
      );

      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(
          isHindi
            ? "Microphone permission allow करें।"
            : "Please allow microphone permission."
        );
      } else if (event.error === "no-speech") {
        alert(
          isHindi
            ? "कोई आवाज़ नहीं मिली। फिर से कोशिश करें।"
            : "No speech detected. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Could not start voice recognition:",
        error
      );

      setIsListening(false);
    }
  };

  // =====================================================
  // 📷 UPLOAD
  // =====================================================

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        isHindi
          ? "कृपया image file चुनें।"
          : "Please select an image file."
      );

      return;
    }

    setImage(file);
    setImagePreview(
      URL.createObjectURL(file)
    );

    setAnalysis("");
    setShowResult(false);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
    setAnalysis("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // 🤖 ANALYZE
  // =====================================================

  const handleAnalyze = async () => {
    if (!problem.trim() && !image) {
      alert(
        isHindi
          ? "कृपया अपनी समस्या लिखें या फोटो अपलोड करें।"
          : "Please describe your problem or upload a photo."
      );

      return;
    }

    // Stop microphone
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    try {
      setLoading(true);

      let base64Image = null;

      // =================================================
      // IMAGE → BASE64
      // =================================================

      if (image) {
        base64Image = await new Promise(
          (resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve(reader.result);
            };

            reader.onerror = () => {
              reject(
                new Error(
                  "Could not read image."
                )
              );
            };

            reader.readAsDataURL(image);
          }
        );
      }

      // =================================================
      // BACKEND
      // =================================================

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            problem: problem.trim(),
            image: base64Image,
            language: language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.details ||
            data.error ||
            "AI analysis failed."
        );
      }

      // =================================================
      // SAVE RESULT
      // =================================================

      setAnalysis(data.analysis);

      // Important:
      // AI response is already in selected language
      lastTranslatedLanguage.current = language;

      setShowResult(true);

    } catch (error) {
      console.error(
        "ANALYZE ERROR:",
        error
      );

      alert(
        error.message ||
          (isHindi
            ? "AI analysis असफल हुआ।"
            : "AI analysis failed.")
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESULT
  // =====================================================

  if (showResult) {
    return (
      <AnalysisResult
        problem={problem}
        image={imagePreview}
        analysis={analysis}
        onBack={() => setShowResult(false)}
        language={language}
        darkMode={darkMode}
      />
    );
  }

  // =====================================================
  // HERO
  // =====================================================

  return (
    <div
      className={`solver-page ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <section className="solver-section">

        {/* ================= LEFT ================= */}

        <div className="solver-left">

          <div className="solver-badge">
            {t.badge}
          </div>

          <h1>
            {t.hero1}

            <br />

            <span>
              {t.hero2}
            </span>
          </h1>

          <p className="solver-description">
            {t.description}
          </p>

          <div className="solver-buttons">

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("problem-box")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              {t.solve}
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              {t.seeHow}
            </button>

          </div>

        </div>

        {/* ================= PROBLEM CARD ================= */}

        <div
          className="problem-card"
          id="problem-box"
        >

          <div className="card-heading">

            <div>

              <span className="small-title">
                {t.yourProblem}
              </span>

              <h2>
                {t.happening}
              </h2>

            </div>

            <div className="sparkle-icon">
              ✦
            </div>

          </div>

          {/* ================= TEXT + MICROPHONE ================= */}

          <div className="text-input-container">

            <textarea
              value={problem}
              onChange={(e) => {
                setProblem(
                  e.target.value
                );

                setShowResult(false);
              }}
              placeholder={t.placeholder}
              rows="4"
            />

            {/* 🎤 MIC */}

            <button
              type="button"
              className={`voice-button ${
                isListening
                  ? "voice-listening"
                  : ""
              }`}
              onClick={handleVoiceInput}
              title={
                isListening
                  ? t.micStop
                  : t.micStart
              }
            >
              {isListening
                ? "⏹️"
                : "🎤"}
            </button>

            {isListening && (
              <div className="voice-status">

                <span className="voice-dot"></span>

                {t.listening}

              </div>
            )}

            <span className="input-hint">
              {t.hint}
            </span>

          </div>

          {/* ================= FILE INPUT ================= */}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden-file-input"
          />

          {/* ================= UPLOAD ================= */}

          {!imagePreview ? (

            <button
              className="upload-box"
              onClick={handleUploadClick}
              type="button"
            >

              <div className="upload-icon">
                📷
              </div>

              <div className="upload-content">

                <strong>
                  {t.upload}
                </strong>

                <span>
                  {t.uploadHint}
                </span>

              </div>

              <div className="upload-arrow">
                ＋
              </div>

            </button>

          ) : (

            <div className="image-preview-box">

              <img
                src={imagePreview}
                alt="Selected problem"
                className="problem-image-preview"
              />

              <div className="image-info">

                <div>

                  <strong>
                    {image.name}
                  </strong>

                  <span>
                    {t.selected}
                  </span>

                </div>

                <button
                  type="button"
                  className="remove-image"
                  onClick={removeImage}
                >
                  {t.remove}
                </button>

              </div>

            </div>

          )}

          {/* ================= ANALYZE ================= */}

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            type="button"
            disabled={loading}
          >
            {loading
              ? t.analyzing
              : t.analyze}
          </button>

        </div>

      </section>

    </div>
  );
}

export default ProblemSolver;