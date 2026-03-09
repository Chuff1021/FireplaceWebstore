"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Upload,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Home,
  Thermometer,
  DollarSign,
  Zap,
  Wind,
  Leaf,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Camera,
  Star,
} from "lucide-react";
import { sampleProducts } from "@/lib/store-config";
import { resolveProductImage } from "@/lib/product-images";

// ─── Types ────────────────────────────────────────────────────────────────────

type FuelType = "gas" | "wood" | "electric" | "pellet" | "unsure";
type RoomSize = "small" | "medium" | "large" | "open";
type Style = "traditional" | "modern" | "rustic" | "transitional";
type Budget = "under2k" | "2k-5k" | "5k-10k" | "over10k";
type InstallType = "new" | "replace" | "insert";

interface DesignAnswers {
  fuelType: FuelType | null;
  roomSize: RoomSize | null;
  style: Style | null;
  budget: Budget | null;
  installType: InstallType | null;
  primaryUse: string | null;
}

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  "fuel",
  "room",
  "style",
  "budget",
  "install",
  "photo",
  "results",
] as const;
type Step = (typeof STEPS)[number];

// ─── Recommendation engine ────────────────────────────────────────────────────

function getRecommendations(answers: DesignAnswers) {
  return sampleProducts
    .filter((p) => {
      if (answers.fuelType === "gas" && !p.name.toLowerCase().includes("gas") && !p.name.toLowerCase().includes("fireplace")) return false;
      if (answers.fuelType === "electric" && !p.name.toLowerCase().includes("electric")) return false;
      if (answers.fuelType === "pellet" && !p.name.toLowerCase().includes("pellet")) return false;
      return true;
    })
    .slice(0, 3)
    .concat(sampleProducts.slice(0, 3))
    .slice(0, 3);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DesignToolPage() {
  const [currentStep, setCurrentStep] = useState<Step>("fuel");
  const [answers, setAnswers] = useState<DesignAnswers>({
    fuelType: null,
    roomSize: null,
    style: null,
    budget: null,
    installType: null,
    primaryUse: null,
  });
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisualization, setGeneratedVisualization] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setCurrentStep(next);
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setCurrentStep(prev);
  };

  const reset = () => {
    setCurrentStep("fuel");
    setAnswers({ fuelType: null, roomSize: null, style: null, budget: null, installType: null, primaryUse: null });
    setUploadedPhoto(null);
    setGeneratedVisualization(null);
  };

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerateVisualization = async () => {
    setIsGenerating(true);
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 3000));
    // In production: call your AI image generation API here
    // e.g. POST /api/ai/visualize with { roomPhoto: uploadedPhoto, productId: recommendations[0].id }
    // For now we show the uploaded photo with an overlay to demonstrate the UX
    setGeneratedVisualization(uploadedPhoto);
    setIsGenerating(false);
    goNext();
  };

  const recommendations = getRecommendations(answers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-stone-900 to-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-7 h-7 text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
              AI-Powered
            </span>
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Fireplace Design Studio
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto">
            Answer a few questions, upload a photo of your room, and our AI will
            recommend the perfect fireplace — then show you exactly how it looks
            in your space.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep !== "results" && (
        <div className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {stepIndex + 1} of {STEPS.length}
              </span>
              <span className="text-sm text-gray-500">{progress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* ── Step 1: Fuel Type ── */}
        {currentStep === "fuel" && (
          <StepCard
            icon={<Flame className="w-8 h-8 text-amber-600" />}
            title="What type of fireplace are you looking for?"
            subtitle="Each fuel type has unique benefits — we'll help you choose."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { value: "gas", icon: <Zap className="w-6 h-6" />, label: "Gas", desc: "Convenient, clean, instant on/off" },
                { value: "wood", icon: <Flame className="w-6 h-6" />, label: "Wood Burning", desc: "Classic ambiance, authentic crackle" },
                { value: "electric", icon: <Zap className="w-6 h-6" />, label: "Electric", desc: "No venting needed, easy install" },
                { value: "pellet", icon: <Leaf className="w-6 h-6" />, label: "Pellet", desc: "Eco-friendly, efficient heating" },
                { value: "unsure", icon: <Sparkles className="w-6 h-6" />, label: "Help Me Decide", desc: "We'll recommend based on your needs" },
              ].map((opt) => (
                <OptionCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  desc={opt.desc}
                  selected={answers.fuelType === opt.value}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, fuelType: opt.value as FuelType }));
                    setTimeout(goNext, 300);
                  }}
                />
              ))}
            </div>
          </StepCard>
        )}

        {/* ── Step 2: Room Size ── */}
        {currentStep === "room" && (
          <StepCard
            icon={<Home className="w-8 h-8 text-amber-600" />}
            title="How large is the room you're heating?"
            subtitle="This helps us match BTU output to your space."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: "small", label: "Small Room", desc: "Up to 400 sq ft — bedroom, den, office", detail: "Up to 15,000 BTU" },
                { value: "medium", label: "Medium Room", desc: "400–800 sq ft — living room, family room", detail: "15,000–30,000 BTU" },
                { value: "large", label: "Large Room", desc: "800–1,500 sq ft — great room, loft", detail: "30,000–50,000 BTU" },
                { value: "open", label: "Open Floor Plan", desc: "1,500+ sq ft — open concept, whole floor", detail: "50,000+ BTU" },
              ].map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  badge={opt.detail}
                  selected={answers.roomSize === opt.value}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, roomSize: opt.value as RoomSize }));
                    setTimeout(goNext, 300);
                  }}
                />
              ))}
            </div>
          </StepCard>
        )}

        {/* ── Step 3: Style ── */}
        {currentStep === "style" && (
          <StepCard
            icon={<Star className="w-8 h-8 text-amber-600" />}
            title="What's your design style?"
            subtitle="We'll match the fireplace aesthetic to your home's character."
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "traditional", label: "Traditional", desc: "Classic mantels, ornate details, timeless elegance" },
                { value: "modern", label: "Modern / Contemporary", desc: "Clean lines, linear flames, minimalist design" },
                { value: "rustic", label: "Rustic / Farmhouse", desc: "Natural stone, reclaimed wood, cozy warmth" },
                { value: "transitional", label: "Transitional", desc: "Blend of classic and modern — versatile appeal" },
              ].map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  selected={answers.style === opt.value}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, style: opt.value as Style }));
                    setTimeout(goNext, 300);
                  }}
                />
              ))}
            </div>
          </StepCard>
        )}

        {/* ── Step 4: Budget ── */}
        {currentStep === "budget" && (
          <StepCard
            icon={<DollarSign className="w-8 h-8 text-amber-600" />}
            title="What's your budget range?"
            subtitle="Including installation. We have options at every price point."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: "under2k", label: "Under $2,000", desc: "Electric inserts, basic gas logs, entry-level units" },
                { value: "2k-5k", label: "$2,000 – $5,000", desc: "Mid-range gas fireplaces, quality wood stoves" },
                { value: "5k-10k", label: "$5,000 – $10,000", desc: "Premium gas fireplaces, high-efficiency inserts" },
                { value: "over10k", label: "$10,000+", desc: "Luxury custom fireplaces, outdoor kitchens, full installs" },
              ].map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  selected={answers.budget === opt.value}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, budget: opt.value as Budget }));
                    setTimeout(goNext, 300);
                  }}
                />
              ))}
            </div>
          </StepCard>
        )}

        {/* ── Step 5: Install Type ── */}
        {currentStep === "install" && (
          <StepCard
            icon={<Thermometer className="w-8 h-8 text-amber-600" />}
            title="What's your installation situation?"
            subtitle="This determines which products will work for your home."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "new", icon: <Home className="w-6 h-6" />, label: "New Construction", desc: "Building a new home or addition — full flexibility" },
                { value: "replace", icon: <RotateCcw className="w-6 h-6" />, label: "Replace Existing", desc: "Upgrading an existing fireplace or hearth" },
                { value: "insert", icon: <Wind className="w-6 h-6" />, label: "Fireplace Insert", desc: "Converting an existing wood-burning fireplace" },
              ].map((opt) => (
                <OptionCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  desc={opt.desc}
                  selected={answers.installType === opt.value}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, installType: opt.value as InstallType }));
                    setTimeout(goNext, 300);
                  }}
                />
              ))}
            </div>
          </StepCard>
        )}

        {/* ── Step 6: Photo Upload ── */}
        {currentStep === "photo" && (
          <StepCard
            icon={<Camera className="w-8 h-8 text-amber-600" />}
            title="Upload a photo of your room"
            subtitle="Our AI will place your recommended fireplace directly into your space so you can see exactly how it looks."
          >
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  uploadedPhoto
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-300 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setUploadedPhoto(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                {uploadedPhoto ? (
                  <div className="space-y-3">
                    <div className="relative w-full max-h-64 overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadedPhoto}
                        alt="Your room"
                        className="w-full object-cover rounded-xl max-h-64"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                    </div>
                    <p className="text-amber-700 font-medium flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Photo uploaded! Click to change.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        Drop your photo here or click to browse
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        JPG, PNG, or WebP — up to 10MB
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Best results: a wide-angle shot of the wall where you want the fireplace
                    </p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">📸 Photo tips for best results:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Take the photo straight-on from the center of the room</li>
                  <li>• Include the full wall where the fireplace will go</li>
                  <li>• Good lighting helps the AI understand your space</li>
                  <li>• Landscape (horizontal) orientation works best</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {uploadedPhoto && (
                  <button
                    onClick={handleGenerateVisualization}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating your visualization…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate AI Visualization
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:border-gray-400 hover:text-gray-800 transition-all"
                >
                  Skip — Show Recommendations
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </StepCard>
        )}

        {/* ── Step 7: Results ── */}
        {currentStep === "results" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                AI Recommendations Ready
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Your Perfect Fireplace Matches
              </h2>
              <p className="text-gray-600">
                Based on your answers, here are our top picks for your home.
              </p>
            </div>

            {/* Visualization Result */}
            {generatedVisualization && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    AI Room Visualization
                  </h3>
                  <p className="text-amber-100 text-sm">Your top recommendation placed in your room</p>
                </div>
                <div className="p-6">
                  <div className="relative rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedVisualization}
                      alt="AI visualization of fireplace in your room"
                      className="w-full object-cover rounded-xl"
                    />
                    {/* Overlay badge */}
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>AI visualization preview</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    🔧 Full AI rendering requires an OpenAI or Stability AI API key — contact us to enable this feature for your store.
                  </p>
                </div>
              </div>
            )}

            {/* Answer Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Your Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: "Fuel Type", value: answers.fuelType },
                  { label: "Room Size", value: answers.roomSize },
                  { label: "Style", value: answers.style },
                  { label: "Budget", value: answers.budget },
                  { label: "Installation", value: answers.installType },
                ].filter((i) => i.value).map((item) => (
                  <div key={item.label} className="bg-amber-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-amber-700 font-medium">{item.label}</p>
                    <p className="text-sm text-gray-800 capitalize">{item.value?.replace(/-/g, " ")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Recommendations */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((product, i) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl shadow-md overflow-hidden border transition-all hover:shadow-xl hover:-translate-y-1 ${
                      i === 0 ? "border-amber-400 ring-2 ring-amber-200" : "border-gray-100"
                    }`}
                  >
                    {i === 0 && (
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-2 text-sm font-semibold">
                        ⭐ Best Match for You
                      </div>
                    )}
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={resolveProductImage(product.images[0], product.images)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-amber-700">
                          ${product.price.toLocaleString()}
                        </span>
                        <Link
                          href={`/product/${product.slug}`}
                          className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-gray-900 to-stone-900 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Ready to bring your vision to life?
              </h3>
              <p className="text-gray-300 mb-6">
                Our fireplace experts in Republic, MO are ready to help you choose, install, and enjoy your perfect fireplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Talk to an Expert
                </Link>
                <Link
                  href="/category/fireplaces"
                  className="px-8 py-3 border border-white/30 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
                >
                  Browse All Fireplaces
                </Link>
                <button
                  onClick={reset}
                  className="px-8 py-3 border border-white/30 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons (non-results steps) */}
        {currentStep !== "results" && currentStep !== "fuel" && (
          <div className="flex justify-between mt-8">
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
          {icon}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {title}
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function OptionCard({
  icon,
  label,
  desc,
  badge,
  selected,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  desc: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md group ${
        selected
          ? "border-amber-500 bg-amber-50 shadow-md"
          : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
      }`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`p-2 rounded-xl flex-shrink-0 ${selected ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-600 group-hover:bg-amber-100 group-hover:text-amber-700"}`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-semibold ${selected ? "text-amber-800" : "text-gray-900"}`}>
              {label}
            </p>
            {selected && <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{desc}</p>
          {badge && (
            <span className="inline-block mt-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
