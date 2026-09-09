import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

// =====================================================
// GEMINI AI
// =====================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GharKaAI Backend is running 🚀",
  });
});

// =====================================================
// GEMINI RESPONSE HELPER
// =====================================================

const generateAIResponse = async (contents) => {
  try {
    console.log("Trying primary Gemini model...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
    });

    return response;
  } catch (firstError) {
    console.log(
      "Primary Gemini model unavailable. Trying fallback..."
    );

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
    });

    return response;
  }
};

// =====================================================
// ANALYZE PROBLEM
// =====================================================

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      problem,
      image,
      language = "en",
    } = req.body;

    // =================================================
    // VALIDATE INPUT
    // =================================================

    if (!problem && !image) {
      return res.status(400).json({
        success: false,
        error: "Please provide a problem or image.",
      });
    }

    const selectedLanguage =
      language === "hi"
        ? "Hindi"
        : "English";

    // =================================================
    // AI PROMPT
    // =================================================

    const prompt = `
You are GharKaAI, an AI household problem assistant.

Analyze the user's household problem carefully.

The selected response language is: ${selectedLanguage}

IMPORTANT LANGUAGE RULES:

- Write the ENTIRE response in ${selectedLanguage}.
- Do not mix Hindi and English unnecessarily.
- If Hindi is selected, use natural and simple Hindi in Devanagari script.
- If English is selected, use clear and simple English.
- Section headings must also follow the selected language.

GENERAL RULES:

- Give a practical and safe answer.
- Do not claim certainty if the issue is unclear.
- If an image is provided, analyze it carefully.
- Do not give dangerous repair instructions.
- For electricity, gas, fire, major plumbing, structural damage or dangerous issues, recommend a qualified professional.
- Repair cost must be approximate only.
- Never claim an exact repair price.

IMPORTANT CATEGORY RULE:

Choose ONE clear repair category.

Examples:

Fan problem → Electrician
Electrical switch issue → Electrician
Water leakage → Plumber
AC problem → AC Repair
Refrigerator → Refrigerator Repair
Washing machine → Washing Machine Repair
Mobile phone → Mobile Repair
Laptop → Laptop Repair
Television → TV Repair
Furniture → Carpenter
Pest problem → Pest Control

Do not return multiple categories separated by "/" or "or".

${
  language === "hi"
    ? `
RETURN THE ANSWER EXACTLY IN THIS FORMAT:

समस्या की पहचान:
समस्या को सरल हिंदी में समझाएं।

संभावित कारण:
संभावित कारण बताएं।

क्या करें:
सरल और सुरक्षित कदम बताएं।

सुरक्षा:
महत्वपूर्ण सुरक्षा सावधानियां बताएं।

अनुमानित श्रेणी:
केवल एक स्पष्ट मरम्मत श्रेणी लिखें।

अनुमानित मरम्मत लागत:
भारतीय रुपये में अनुमानित लागत की रेंज बताएं।
`
    : `
RETURN THE ANSWER EXACTLY IN THIS FORMAT:

PROBLEM IDENTIFIED:
Explain the likely problem.

POSSIBLE CAUSE:
Explain the possible causes.

WHAT TO DO:
Give practical and safe steps.

SAFETY:
Mention important safety precautions.

ESTIMATED CATEGORY:
Give only ONE clear repair category.

ESTIMATED REPAIR COST:
Give an approximate repair cost range in Indian Rupees.
`
}

USER'S PROBLEM:

${problem || "The user uploaded an image. Analyze the image carefully."}
`;

    // =================================================
    // CONTENT ARRAY
    // =================================================

    const contents = [];

    // =================================================
    // ADD IMAGE
    // =================================================

    if (image) {
      const match = image.match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
      );

      if (match) {
        contents.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    // =================================================
    // ADD PROMPT
    // =================================================

    contents.push({
      text: prompt,
    });

    // =================================================
    // GENERATE RESPONSE
    // =================================================

    const response =
      await generateAIResponse(contents);

    const analysis =
      response.text ||
      "No AI response generated.";

    // =================================================
    // SEND RESPONSE
    // =================================================

    res.json({
      success: true,
      language: selectedLanguage,
      analysis,
    });

  } catch (error) {
    console.error(
      "GEMINI AI ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      error: "AI analysis failed.",
      details:
        error?.message ||
        "Unknown error",
    });
  }
});

// =====================================================
// TRANSLATE ANALYSIS
// =====================================================

app.post("/api/translate", async (req, res) => {
  try {
    const {
      analysis,
      language,
    } = req.body;

    if (!analysis) {
      return res.status(400).json({
        success: false,
        error: "Analysis text is required.",
      });
    }

    if (language !== "hi") {
      return res.json({
        success: true,
        analysis,
      });
    }

    const prompt = `
Translate the following household problem analysis into natural,
simple Hindi using Devanagari script.

IMPORTANT:

- Keep the meaning exactly the same.
- Do not remove information.
- Do not add new information.
- Preserve the same section structure.
- Translate all headings into Hindi.
- Use simple language.

TEXT:

${analysis}
`;

    const response =
      await generateAIResponse([
        {
          text: prompt,
        },
      ]);

    res.json({
      success: true,
      analysis:
        response.text ||
        analysis,
    });

  } catch (error) {
    console.error(
      "TRANSLATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Translation failed.",
      details:
        error?.message ||
        "Unknown error",
    });
  }
});

// =====================================================
// DISTANCE CALCULATION
// HAVERSINE FORMULA
// =====================================================

const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

// =====================================================
// CREATE RECTANGLE FROM RADIUS
// =====================================================

const createLocationRectangle = (
  latitude,
  longitude,
  radiusMeters
) => {
  const latitudeDelta =
    radiusMeters / 111320;

  const longitudeDelta =
    radiusMeters /
    (
      111320 *
      Math.cos(
        (latitude * Math.PI) / 180
      )
    );

  return {
    low: {
      latitude:
        latitude - latitudeDelta,
      longitude:
        longitude - longitudeDelta,
    },

    high: {
      latitude:
        latitude + latitudeDelta,
      longitude:
        longitude + longitudeDelta,
    },
  };
};

// =====================================================
// FORMAT DISTANCE
// =====================================================

const formatDistance = (
  distanceKm
) => {
  if (distanceKm < 1) {
    return `${Math.round(
      distanceKm * 1000
    )} meters away`;
  }

  return `${distanceKm.toFixed(
    1
  )} km away`;
};

// =====================================================
// NORMALIZE CATEGORY
// =====================================================

const normalizeCategory = (
  category = ""
) => {
  return category
    .toLowerCase()
    .replace(/[:\-•]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// =====================================================
// BUILD BETTER SEARCH QUERIES
// =====================================================

const buildSearchQueries = (
  category
) => {
  const value =
    normalizeCategory(category);

  // FAN / ELECTRICAL
  if (
    value.includes("fan") ||
    value.includes("पंख") ||
    value.includes("electric") ||
    value.includes("बिजली") ||
    value.includes("इलेक्ट्री")
  ) {
    return [
      "electrician",
      "electrical repair service",
      "fan repair service",
    ];
  }

  // PLUMBER
  if (
    value.includes("plumb") ||
    value.includes("pipe") ||
    value.includes("leak") ||
    value.includes("नल") ||
    value.includes("पाइप")
  ) {
    return [
      "plumber",
      "plumbing service",
    ];
  }

  // AC
  if (
    value.includes("ac") ||
    value.includes("air condition") ||
    value.includes("एसी")
  ) {
    return [
      "air conditioning repair",
      "ac repair service",
    ];
  }

  // MOBILE
  if (
    value.includes("mobile") ||
    value.includes("phone") ||
    value.includes("smartphone") ||
    value.includes("मोबाइल")
  ) {
    return [
      "mobile phone repair",
      "cell phone repair service",
    ];
  }

  // LAPTOP
  if (
    value.includes("laptop") ||
    value.includes("computer") ||
    value.includes("कंप्यूटर") ||
    value.includes("लैपटॉप")
  ) {
    return [
      "laptop repair",
      "computer repair service",
    ];
  }

  // TV
  if (
    value.includes("tv") ||
    value.includes("television") ||
    value.includes("television repair") ||
    value.includes("टीवी")
  ) {
    return [
      "television repair service",
      "tv repair",
    ];
  }

  // REFRIGERATOR
  if (
    value.includes("refrigerator") ||
    value.includes("fridge") ||
    value.includes("फ्रिज")
  ) {
    return [
      "refrigerator repair",
      "fridge repair service",
    ];
  }

  // WASHING MACHINE
  if (
    value.includes("washing") ||
    value.includes("washing machine") ||
    value.includes("वॉशिंग")
  ) {
    return [
      "washing machine repair",
      "appliance repair service",
    ];
  }

  // CARPENTER
  if (
    value.includes("carpenter") ||
    value.includes("furniture") ||
    value.includes("door repair") ||
    value.includes("बढ़ई") ||
    value.includes("फर्नीचर")
  ) {
    return [
      "carpenter",
      "furniture repair",
    ];
  }

  // PEST CONTROL
  if (
    value.includes("pest") ||
    value.includes("insect") ||
    value.includes("termite") ||
    value.includes("कीट")
  ) {
    return [
      "pest control service",
    ];
  }

  // GAS
  if (
    value.includes("gas") ||
    value.includes("गैस")
  ) {
    return [
      "gas appliance repair",
      "gas stove repair",
    ];
  }

  // FALLBACK
  return [
    `${category} repair service`,
    category,
  ];
};

// =====================================================
// GOOGLE PLACES SEARCH
// =====================================================

const searchGooglePlaces = async ({
  query,
  latitude,
  longitude,
  radius,
}) => {
  const rectangle =
    createLocationRectangle(
      latitude,
      longitude,
      radius
    );

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "X-Goog-Api-Key":
          process.env.GOOGLE_MAPS_API_KEY,

        "X-Goog-FieldMask":
          [
            "places.id",
            "places.displayName",
            "places.formattedAddress",
            "places.location",
            "places.rating",
            "places.userRatingCount",
            "places.nationalPhoneNumber",
            "places.googleMapsUri",
          ].join(","),
      },

      body: JSON.stringify({
        textQuery: query,

        locationRestriction: {
          rectangle,
        },

        rankPreference:
          "DISTANCE",

        pageSize: 20,

        languageCode: "en",

        regionCode: "IN",
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "GOOGLE PLACES ERROR:",
      errorText
    );

    throw new Error(
      errorText
    );
  }

  const data =
    await response.json();

  return data.places || [];
};

// =====================================================
// NEARBY REPAIR SERVICES
// =====================================================

app.post(
  "/api/nearby-repair",
  async (req, res) => {
    try {
      const {
        latitude,
        longitude,
        category,
      } = req.body;

      // ===============================================
      // VALIDATE LOCATION
      // ===============================================

      if (
        latitude === undefined ||
        longitude === undefined
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Location is required.",
        });
      }

      const userLatitude =
        Number(latitude);

      const userLongitude =
        Number(longitude);

      if (
        Number.isNaN(userLatitude) ||
        Number.isNaN(userLongitude)
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid location coordinates.",
        });
      }

      // ===============================================
      // VALIDATE CATEGORY
      // ===============================================

      if (!category) {
        return res.status(400).json({
          success: false,
          error:
            "Repair category is required.",
        });
      }

      // ===============================================
      // CHECK API KEY
      // ===============================================

      if (
        !process.env.GOOGLE_MAPS_API_KEY
      ) {
        return res.status(500).json({
          success: false,
          error:
            "Google Maps API key is missing.",
        });
      }

      console.log(
        "===================================="
      );

      console.log(
        "Searching nearest repair services"
      );

      console.log({
        latitude:
          userLatitude,

        longitude:
          userLongitude,

        category,
      });

      console.log(
        "===================================="
      );

      // ===============================================
      // CREATE SEARCH QUERIES
      // ===============================================

      const searchQueries =
        buildSearchQueries(category);

      console.log(
        "Search queries:",
        searchQueries
      );

      // ===============================================
      // SEARCH RADII
      //
      // We start very close.
      // Expand only when required.
      // ===============================================

      const searchRadii = [
        3000,
        7000,
        15000,
        25000,
      ];

      const allPlaces =
        new Map();

      let usedRadius = 3000;

      // ===============================================
      // SEARCH PROGRESSIVELY
      // ===============================================

      for (
        const radius of searchRadii
      ) {
        usedRadius = radius;

        console.log(
          `Searching inside ${radius / 1000} km`
        );

        // Search multiple useful categories
        const searchResults =
          await Promise.all(
            searchQueries.map(
              async (query) => {
                try {
                  return await searchGooglePlaces({
                    query,
                    latitude:
                      userLatitude,
                    longitude:
                      userLongitude,
                    radius,
                  });
                } catch (error) {
                  console.error(
                    `Search failed for "${query}":`,
                    error.message
                  );

                  return [];
                }
              }
            )
          );

        // =============================================
        // ADD UNIQUE RESULTS
        // =============================================

        searchResults
          .flat()
          .forEach((place) => {
            if (
              place?.id &&
              place?.location
            ) {
              allPlaces.set(
                place.id,
                place
              );
            }
          });

        // =============================================
        // CALCULATE ACTUAL DISTANCES
        // =============================================

        const currentShops =
          Array.from(
            allPlaces.values()
          )
            .map((place) => {
              const distanceValue =
                calculateDistance(
                  userLatitude,
                  userLongitude,
                  place.location.latitude,
                  place.location.longitude
                );

              return {
                place,
                distanceValue,
              };
            })

            // IMPORTANT:
            // FINAL STRICT DISTANCE FILTER
            //
            // Google result must actually be
            // inside the selected radius.
            .filter(
              (item) =>
                item.distanceValue <=
                radius / 1000
            )

            .sort(
              (a, b) =>
                a.distanceValue -
                b.distanceValue
            );

        console.log(
          `Actual nearby shops inside ${radius / 1000} km:`,
          currentShops.length
        );

        // =============================================
        // STOP WHEN WE HAVE ENOUGH LOCAL RESULTS
        // =============================================

        if (
          currentShops.length >= 3 ||
          radius ===
            searchRadii[
              searchRadii.length - 1
            ]
        ) {
          break;
        }
      }

      // ===============================================
      // FORMAT ALL RESULTS
      // ===============================================

      const repairShops =
        Array.from(
          allPlaces.values()
        )
          .map((place) => {
            const distanceValue =
              calculateDistance(
                userLatitude,
                userLongitude,
                place.location.latitude,
                place.location.longitude
              );

            return {
              id:
                place.id,

              name:
                place.displayName?.text ||
                "Repair Service",

              address:
                place.formattedAddress ||
                "Address unavailable",

              latitude:
                place.location?.latitude ||
                null,

              longitude:
                place.location?.longitude ||
                null,

              rating:
                place.rating ||
                null,

              reviewCount:
                place.userRatingCount ||
                null,

              phone:
                place.nationalPhoneNumber ||
                null,

              distance:
                formatDistance(
                  distanceValue
                ),

              distanceValue,

              mapsUrl:
                place.googleMapsUri ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${place.location.latitude},${place.location.longitude}`
                )}`,
            };
          })

          // =============================================
          // STRICT FINAL FILTER
          // =============================================

          .filter(
            (shop) =>
              shop.distanceValue <=
              usedRadius / 1000
          )

          .sort(
            (a, b) =>
              a.distanceValue -
              b.distanceValue
          )

          .slice(0, 10);

      // ===============================================
      // LOG RESULTS
      // ===============================================

      console.log(
        "FINAL NEAREST SHOPS:"
      );

      repairShops.forEach(
        (shop, index) => {
          console.log(
            `${index + 1}. ${shop.name} - ${shop.distance}`
          );
        }
      );

      // ===============================================
      // RESPONSE
      // ===============================================

      res.json({
        success: true,

        category,

        count:
          repairShops.length,

        searchRadiusKm:
          usedRadius / 1000,

        userLocation: {
          latitude:
            userLatitude,

          longitude:
            userLongitude,
        },

        shops:
          repairShops,
      });

    } catch (error) {
      console.error(
        "NEARBY REPAIR ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        error:
          "Failed to find nearby repair services.",

        details:
          error?.message ||
          "Unknown error",
      });
    }
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `GharKaAI Backend running on port ${PORT}`
  );
});