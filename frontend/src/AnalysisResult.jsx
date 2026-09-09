import { useEffect, useState } from "react";
import "./AnalysisResult.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AnalysisResult({
  problem,
  image,
  analysis,
  onBack,
  language = "en",
  darkMode = false,
}) {
  const isHindi = language === "hi";

  // =====================================================
  // TRANSLATED ANALYSIS
  // =====================================================

  const [displayAnalysis, setDisplayAnalysis] = useState(
    analysis || ""
  );

  const [isTranslating, setIsTranslating] = useState(false);

  // Keep original AI response
  const [originalAnalysis] = useState(
    analysis || ""
  );

  // =====================================================
  // NEARBY REPAIR SHOPS
  // =====================================================

  const [shops, setShops] = useState([]);
  const [isFindingShops, setIsFindingShops] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [shopsLoaded, setShopsLoaded] = useState(false);
  const [searchRadiusKm, setSearchRadiusKm] = useState(null);

  // =====================================================
  // LANGUAGE CHANGE
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const translateAnalysis = async () => {
      if (!originalAnalysis) {
        setDisplayAnalysis("");
        return;
      }

      // English = original response
      if (language === "en") {
        setDisplayAnalysis(originalAnalysis);
        return;
      }

      try {
        setIsTranslating(true);

        console.log(
          "Translating AI response to Hindi..."
        );

        const response = await fetch(
          `${API_BASE_URL}/api/translate`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              analysis: originalAnalysis,
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

        if (!cancelled && data.analysis) {
          setDisplayAnalysis(data.analysis);
        }
      } catch (error) {
        console.error(
          "TRANSLATION ERROR:",
          error
        );

        // Keep original answer if translation fails
        if (!cancelled) {
          setDisplayAnalysis(originalAnalysis);
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    };

    translateAnalysis();

    return () => {
      cancelled = true;
    };
  }, [language, originalAnalysis]);

  // =====================================================
  // AI RESPONSE PARSER
  // =====================================================

  const getSection = (
    title,
    nextTitles = []
  ) => {
    if (!displayAnalysis) return "";

    const escapedTitle = title.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const nextPattern = nextTitles
      .map((item) =>
        item.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )
      )
      .join("|");

    const regex = new RegExp(
      `${escapedTitle}\\s*:?\\s*([\\s\\S]*?)(?=${
        nextPattern || "$"
      }|$)`,
      "i"
    );

    const match =
      displayAnalysis.match(regex);

    return match
      ? match[1].trim()
      : "";
  };

  // =====================================================
  // HEADINGS
  // =====================================================

  const problemTitle = isHindi
    ? "समस्या की पहचान"
    : "PROBLEM IDENTIFIED";

  const causeTitle = isHindi
    ? "संभावित कारण"
    : "POSSIBLE CAUSE";

  const actionTitle = isHindi
    ? "क्या करें"
    : "WHAT TO DO";

  const safetyTitle = isHindi
    ? "सुरक्षा"
    : "SAFETY";

  const categoryTitle = isHindi
    ? "अनुमानित श्रेणी"
    : "ESTIMATED CATEGORY";

  const priceTitle = isHindi
    ? "अनुमानित मरम्मत लागत"
    : "ESTIMATED REPAIR COST";

  // =====================================================
  // GET SECTIONS
  // =====================================================

  const problemIdentified =
    isHindi
      ? getSection(
          "समस्या की पहचान",
          [
            "संभावित कारण",
            "क्या करें",
            "सुरक्षा",
            "अनुमानित श्रेणी",
            "अनुमानित मरम्मत लागत",
          ]
        )
      : getSection(
          "PROBLEM IDENTIFIED",
          [
            "POSSIBLE CAUSE",
            "WHAT TO DO",
            "SAFETY",
            "ESTIMATED CATEGORY",
            "ESTIMATED REPAIR COST",
          ]
        );

  const possibleCause =
    isHindi
      ? getSection(
          "संभावित कारण",
          [
            "क्या करें",
            "सुरक्षा",
            "अनुमानित श्रेणी",
            "अनुमानित मरम्मत लागत",
          ]
        )
      : getSection(
          "POSSIBLE CAUSE",
          [
            "WHAT TO DO",
            "SAFETY",
            "ESTIMATED CATEGORY",
            "ESTIMATED REPAIR COST",
          ]
        );

  const whatToDo =
    isHindi
      ? getSection(
          "क्या करें",
          [
            "सुरक्षा",
            "अनुमानित श्रेणी",
            "अनुमानित मरम्मत लागत",
          ]
        )
      : getSection(
          "WHAT TO DO",
          [
            "SAFETY",
            "ESTIMATED CATEGORY",
            "ESTIMATED REPAIR COST",
          ]
        );

  const safety =
    isHindi
      ? getSection(
          "सुरक्षा",
          [
            "अनुमानित श्रेणी",
            "अनुमानित मरम्मत लागत",
          ]
        )
      : getSection(
          "SAFETY",
          [
            "ESTIMATED CATEGORY",
            "ESTIMATED REPAIR COST",
          ]
        );

  const estimatedCategory =
    isHindi
      ? getSection(
          "अनुमानित श्रेणी",
          [
            "अनुमानित मरम्मत लागत",
          ]
        )
      : getSection(
          "ESTIMATED CATEGORY",
          [
            "ESTIMATED REPAIR COST",
          ]
        );

  const estimatedCost =
    isHindi
      ? getSection(
          "अनुमानित मरम्मत लागत"
        )
      : getSection(
          "ESTIMATED REPAIR COST"
        );

  // =====================================================
  // FALLBACK TEXT
  // =====================================================

  const finalProblem =
    problemIdentified ||
    (
      isHindi
        ? "AI समस्या की सटीक पहचान नहीं कर सका।"
        : "The AI could not identify the exact problem."
    );

  const finalCause =
    possibleCause ||
    (
      isHindi
        ? "सटीक कारण के लिए आगे जांच की आवश्यकता हो सकती है।"
        : "The exact cause may require further inspection."
    );

  const finalAction =
    whatToDo ||
    (
      isHindi
        ? "मरम्मत करने से पहले प्रभावित स्थान की सावधानीपूर्वक जांच करें।"
        : "Inspect the affected area carefully before attempting repairs."
    );

  const finalSafety =
    safety ||
    (
      isHindi
        ? "यदि समस्या बिजली, गैस, बड़ी पाइपलाइन या संरचनात्मक नुकसान से जुड़ी है, तो योग्य विशेषज्ञ से संपर्क करें।"
        : "If the problem involves electricity, gas, major plumbing, or structural damage, contact a qualified professional."
    );

  const finalCategory =
    estimatedCategory ||
    (
      isHindi
        ? "सामान्य घरेलू रखरखाव"
        : "General household maintenance"
    );

  const finalCost =
    estimatedCost ||
    (
      isHindi
        ? "लागत का अनुमान उपलब्ध नहीं है।"
        : "Cost estimate unavailable."
    );

  // =====================================================
  // FIND NEARBY REPAIR SHOPS
  // =====================================================

  const findNearbyRepairShops = () => {
    setLocationError("");
    setShops([]);
    setShopsLoaded(false);
    setSearchRadiusKm(null);

    if (!navigator.geolocation) {
      setLocationError(
        isHindi
          ? "आपके ब्राउज़र में लोकेशन सुविधा उपलब्ध नहीं है।"
          : "Geolocation is not supported by your browser."
      );

      return;
    }

    setIsFindingShops(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const accuracy =
            position.coords.accuracy;

          console.log(
            "================================="
          );

          console.log(
            "CURRENT USER LOCATION"
          );

          console.log({
            latitude,
            longitude,
            accuracy,
          });

          console.log(
            "SEARCHING CATEGORY:",
            finalCategory
          );

          console.log(
            "================================="
          );

          const response = await fetch(
            `${API_BASE_URL}/api/nearby-repair`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                latitude,
                longitude,
                category: finalCategory,
              }),
            }
          );

          const data =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.details ||
                data.error ||
                "Unable to find repair services."
            );
          }

          console.log(
            "NEARBY REPAIR RESPONSE:",
            data
          );

          setShops(
            data.shops || []
          );

          setSearchRadiusKm(
            data.searchRadiusKm || null
          );

          setShopsLoaded(true);

        } catch (error) {
          console.error(
            "NEARBY REPAIR ERROR:",
            error
          );

          setLocationError(
            isHindi
              ? "आस-पास की रिपेयर सेवाएं खोजने में समस्या हुई। कृपया दोबारा प्रयास करें।"
              : "Unable to find nearby repair services. Please try again."
          );

          setShopsLoaded(false);

        } finally {
          setIsFindingShops(false);
        }
      },

      (error) => {
        console.error(
          "LOCATION ERROR:",
          error
        );

        let errorMessage =
          isHindi
            ? "लोकेशन प्राप्त नहीं हो सकी।"
            : "Unable to get your location.";

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          errorMessage =
            isHindi
              ? "लोकेशन अनुमति नहीं दी गई। कृपया ब्राउज़र सेटिंग्स से लोकेशन अनुमति दें।"
              : "Location permission was denied. Please allow location access in your browser.";
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          errorMessage =
            isHindi
              ? "आपकी वर्तमान लोकेशन उपलब्ध नहीं है।"
              : "Your current location is unavailable.";
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          errorMessage =
            isHindi
              ? "लोकेशन प्राप्त करने में बहुत समय लगा। कृपया दोबारा प्रयास करें।"
              : "Location request timed out. Please try again.";
        }

        setLocationError(
          errorMessage
        );

        setIsFindingShops(false);
        setShopsLoaded(false);
      },

      {
        enableHighAccuracy: true,

        timeout: 20000,

        // Always request fresh location
        maximumAge: 0,
      }
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className={
        darkMode
          ? "analysis-page analysis-dark"
          : "analysis-page"
      }
    >

      {/* HEADER */}

      <header className="analysis-header">

        <div className="analysis-logo">
          🏠 <span>GharKaAI</span>
        </div>

        <button
          className="back-button"
          onClick={onBack}
        >
          ←{" "}
          {isHindi
            ? "वापस"
            : "Back"}
        </button>

      </header>


      <main className="analysis-main">

        {/* TITLE */}

        <div className="analysis-title">

          <span>
            ✨{" "}
            {isHindi
              ? "AI विश्लेषण"
              : "AI ANALYSIS"}
          </span>

          <h1>
            {isHindi
              ? "हमें यह समस्या मिली"
              : "Here's what we found"}
          </h1>

          <p>
            {isHindi
              ? "GharKaAI ने आपके द्वारा दी गई जानकारी का AI की मदद से विश्लेषण किया।"
              : "GharKaAI analyzed the information you provided using AI."}
          </p>

        </div>


        {/* YOUR PROBLEM */}

        <section className="analysis-problem-card">

          <div className="analysis-card-label">
            {isHindi
              ? "आपकी समस्या"
              : "YOUR PROBLEM"}
          </div>

          <h2>
            {problem ||
              (
                isHindi
                  ? "घरेलू समस्या"
                  : "Household problem"
              )}
          </h2>

          {image && (
            <img
              src={image}
              alt="Uploaded problem"
              className="problem-image"
            />
          )}

        </section>


        {/* TRANSLATION STATUS */}

        {isTranslating && (
          <div className="translation-status">
            {isHindi
              ? "AI जवाब को हिंदी में बदला जा रहा है..."
              : "Translating AI response..."}
          </div>
        )}


        {/* AI RESULTS */}

        <section className="result-grid">

          {/* PROBLEM */}

          <div className="result-card">

            <div className="result-icon">
              🔍
            </div>

            <span>
              {problemTitle}
            </span>

            <h3>
              {isHindi
                ? "पहचानी गई समस्या"
                : "Identified problem"}
            </h3>

            <p>
              {finalProblem}
            </p>

          </div>


          {/* CAUSE */}

          <div className="result-card">

            <div className="result-icon">
              🧠
            </div>

            <span>
              {causeTitle}
            </span>

            <h3>
              {isHindi
                ? "संभावित कारण"
                : "Possible cause"}
            </h3>

            <p>
              {finalCause}
            </p>

          </div>


          {/* WHAT TO DO */}

          <div className="result-card">

            <div className="result-icon">
              🛠️
            </div>

            <span>
              {actionTitle}
            </span>

            <h3>
              {isHindi
                ? "सुझाया गया कदम"
                : "Recommended action"}
            </h3>

            <p>
              {finalAction}
            </p>

          </div>


          {/* SAFETY */}

          <div className="result-card safety-card">

            <div className="result-icon">
              ⚠️
            </div>

            <span>
              {safetyTitle}
            </span>

            <h3>
              {isHindi
                ? "सुरक्षा सावधानियां"
                : "Safety precautions"}
            </h3>

            <p>
              {finalSafety}
            </p>

          </div>


          {/* CATEGORY */}

          <div className="result-card category-card">

            <div className="result-icon">
              🏷️
            </div>

            <span>
              {categoryTitle}
            </span>

            <h3>
              {isHindi
                ? "मरम्मत श्रेणी"
                : "Repair category"}
            </h3>

            <p>
              {finalCategory}
            </p>

          </div>


          {/* ESTIMATED COST */}

          <div className="result-card price-card">

            <div className="result-icon">
              💰
            </div>

            <span>
              {priceTitle}
            </span>

            <h3>
              {isHindi
                ? "अनुमानित खर्च"
                : "Estimated cost"}
            </h3>

            <p className="estimated-cost-value">
              {finalCost}
            </p>

            <small>
              {isHindi
                ? "यह केवल अनुमानित लागत है। वास्तविक कीमत स्थान, पार्ट्स और श्रम के अनुसार बदल सकती है।"
                : "This is an approximate cost. Actual pricing may vary by location, parts and labour."}
            </small>

          </div>

        </section>


        {/* =================================================
            NEARBY REPAIR SERVICES
        ================================================= */}

        <section className="nearby-repair-section">

          <div className="nearby-repair-heading">

            <div>

              <span>
                📍{" "}
                {isHindi
                  ? "आपके पास"
                  : "NEAR YOU"}
              </span>

              <h2>
                {isHindi
                  ? "आस-पास की रिपेयर सेवाएं"
                  : "Nearby Repair Services"}
              </h2>

              <p>
                {isHindi
                  ? `आपकी लोकेशन के आधार पर ${finalCategory} से संबंधित सेवाएं खोजें।`
                  : `Find nearby professionals for ${finalCategory}.`}
              </p>

            </div>

          </div>


          {!shopsLoaded && !isFindingShops && !locationError && (

            <div className="nearby-search-box">

              <div className="nearby-search-icon">
                🔧
              </div>

              <h3>
                {isHindi
                  ? "अपने पास रिपेयर एक्सपर्ट खोजें"
                  : "Find repair experts near you"}
              </h3>

              <p>
                {isHindi
                  ? "हम आपकी अनुमति से आपकी वर्तमान लोकेशन का उपयोग करके आस-पास की रिपेयर दुकानों की जानकारी दिखाएंगे।"
                  : "With your permission, we will use your current location to find nearby repair shops and professionals."}
              </p>

              <button
                className="find-repair-button"
                onClick={findNearbyRepairShops}
              >
                📍{" "}
                {isHindi
                  ? "आस-पास की सेवाएं खोजें"
                  : "Find Nearby Services"}
              </button>

            </div>
          )}


          {isFindingShops && (

            <div className="nearby-loading">

              <div className="location-loader"></div>

              <h3>
                {isHindi
                  ? "आपके पास रिपेयर सेवाएं खोजी जा रही हैं..."
                  : "Finding repair services near you..."}
              </h3>

              <p>
                {isHindi
                  ? "आपकी वर्तमान लोकेशन के अनुसार सबसे नज़दीकी सेवाएं खोजी जा रही हैं।"
                  : "Searching for the nearest services based on your current location."}
              </p>

            </div>
          )}


          {locationError && !isFindingShops && (

            <div className="location-error">

              <div>
                ⚠️
              </div>

              <p>
                {locationError}
              </p>

              <button
                onClick={findNearbyRepairShops}
              >
                {isHindi
                  ? "दोबारा प्रयास करें"
                  : "Try Again"}
              </button>

            </div>
          )}


          {shopsLoaded &&
            shops.length === 0 &&
            !isFindingShops && (

            <div className="no-shops">

              <div>
                🔍
              </div>

              <h3>
                {isHindi
                  ? "कोई रिपेयर सेवा नहीं मिली"
                  : "No repair services found"}
              </h3>

              <p>
                {isHindi
                  ? "आपके आस-पास कोई उपयुक्त रिपेयर सेवा नहीं मिली। आप दोबारा खोजने का प्रयास कर सकते हैं।"
                  : "We could not find suitable repair services nearby. You can try searching again."}
              </p>

              <button
                onClick={findNearbyRepairShops}
              >
                {isHindi
                  ? "फिर से खोजें"
                  : "Search Again"}
              </button>

            </div>
          )}


          {shops.length > 0 && (

            <>

              <div className="shops-found-info">

                <span>
                  🔧
                </span>

                <p>
                  {isHindi
                    ? `${shops.length} नज़दीकी रिपेयर सेवाएं मिलीं${
                        searchRadiusKm
                          ? ` (${searchRadiusKm} किमी के अंदर खोजा गया)`
                          : ""
                      }`
                    : `${shops.length} nearby repair services found${
                        searchRadiusKm
                          ? ` within a ${searchRadiusKm} km search area`
                          : ""
                      }`}
                </p>

                <button
                  onClick={findNearbyRepairShops}
                >
                  ↻{" "}
                  {isHindi
                    ? "दोबारा खोजें"
                    : "Refresh"}
                </button>

              </div>


              <div className="repair-shops-grid">

                {shops.map((shop) => (

                  <div
                    className="repair-shop-card"
                    key={shop.id}
                  >

                    <div className="shop-top">

                      <div className="shop-icon">
                        🔧
                      </div>

                      <div className="shop-rating">

                        {shop.rating
                          ? (
                            <>
                              ⭐ {shop.rating}
                            </>
                          )
                          : (
                            <>
                              ⭐ N/A
                            </>
                          )}

                      </div>

                    </div>


                    <h3>
                      {shop.name}
                    </h3>


                    {shop.reviewCount && (
                      <p className="review-count">
                        {shop.reviewCount}{" "}
                        {isHindi
                          ? "समीक्षाएं"
                          : "reviews"}
                      </p>
                    )}


                    <div className="shop-details">

                      <div>

                        <span>
                          📍
                        </span>

                        <p>
                          {shop.address}
                        </p>

                      </div>


                      <div>

                        <span>
                          📏
                        </span>

                        <p>
                          {shop.distance}
                        </p>

                      </div>


                      {shop.phone && (

                        <div>

                          <span>
                            📞
                          </span>

                          <p>
                            {shop.phone}
                          </p>

                        </div>
                      )}

                    </div>


                    <div className="shop-actions">

                      {shop.phone ? (

                        <a
                          href={`tel:${shop.phone}`}
                          className="call-shop-button"
                        >
                          📞{" "}
                          {isHindi
                            ? "कॉल करें"
                            : "Call"}
                        </a>

                      ) : (

                        <button
                          className="call-shop-button disabled"
                          disabled
                        >
                          📞{" "}
                          {isHindi
                            ? "नंबर उपलब्ध नहीं"
                            : "No Phone"}
                        </button>

                      )}


                      <a
                        href={shop.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="direction-button"
                      >
                        🗺️{" "}
                        {isHindi
                          ? "दिशा देखें"
                          : "Directions"}
                      </a>

                    </div>

                  </div>

                ))}

              </div>

            </>
          )}

        </section>


        {/* NEXT STEPS */}

        <section className="next-steps">

          <span>
            {isHindi
              ? "अगले कदम"
              : "NEXT STEPS"}
          </span>

          <h2>
            {isHindi
              ? "अब आपको क्या करना चाहिए"
              : "What you should do now"}
          </h2>

          <div className="steps-list">

            <div>

              <b>
                01
              </b>

              <p>
                {isHindi
                  ? "AI द्वारा दिए गए सुझाव को ध्यान से पढ़ें।"
                  : "Read the AI diagnosis carefully."}
              </p>

            </div>


            <div>

              <b>
                02
              </b>

              <p>
                {isHindi
                  ? "सुझाए गए कदम तभी अपनाएं जब वे आपके लिए सुरक्षित हों।"
                  : "Follow the recommended steps only if they are safe for you to perform."}
              </p>

            </div>


            <div>

              <b>
                03
              </b>

              <p>
                {isHindi
                  ? "यदि समस्या खतरनाक या जटिल है, तो योग्य विशेषज्ञ से संपर्क करें।"
                  : "If the issue is dangerous or complicated, contact a qualified professional."}
              </p>

            </div>

          </div>

        </section>


        {/* FULL AI RESPONSE */}

        <section className="full-ai-response">

          <span>
            {isHindi
              ? "पूरा AI जवाब"
              : "FULL AI RESPONSE"}
          </span>

          <pre>
            {displayAnalysis ||
              (
                isHindi
                  ? "AI से कोई जवाब प्राप्त नहीं हुआ।"
                  : "No AI response received."
              )}
          </pre>

        </section>

      </main>

    </div>
  );
}

export default AnalysisResult;