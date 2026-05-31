import React, { useState, useEffect } from "react";
import { 
  User, Lock, Mail, Phone, Key, Check, LogOut, Settings, 
  Trash2, Plus, Search, CheckCircle, Download, Upload, AlertCircle, 
  Edit2, ArrowLeft, RefreshCw, Eye, EyeOff, ShieldCheck, 
  MapPin, Heart, Share2, Award, Calendar, Folder, BookOpen, Image, Briefcase
} from "lucide-react";
import { dbInstance, UserProfile, Volunteer, DonationRecord } from "../lib/db";
import { Pillar } from "../types";
import { PILLARS_DATA } from "../data";

// Interfaces
interface AuthSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginStatusChange: () => void;
}

export default function AuthSystem({ isOpen, onClose, onLoginStatusChange }: AuthSystemProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pvp_current_user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("pvp_current_user");
    setCurrentUser(null);
    onLoginStatusChange();
    onClose();
    alert("लॉगआउट सफल हुआ! (Logout Successful)");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#f5f1e8] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col relative">
        
        {/* Absolute Close Header Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-stone-600 hover:text-stone-900 bg-stone-200/50 hover:bg-stone-200 p-2 rounded-full cursor-pointer transition-colors"
          title="बंद करें"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {currentUser ? (
            currentUser.role === "admin" && currentUser.email.toLowerCase() === "tomarvansh475@gmail.com" ? (
              <AdminDashboard user={currentUser} onLogout={handleLogout} onClose={onClose} />
            ) : (
              <UserProfileView user={currentUser} onLogout={handleLogout} onUpdate={() => {
                const updated = localStorage.getItem("pvp_current_user");
                if (updated) setCurrentUser(JSON.parse(updated));
                onLoginStatusChange();
              }} />
            )
          ) : (
            <AuthModal onLoginSuccess={(u) => {
              localStorage.setItem("pvp_current_user", JSON.stringify(u));
              setCurrentUser(u);
              onLoginStatusChange();
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// AUTHENTICATION MODAL (LOGIN / SIGNUP / OTP / RESET)
// ----------------------------------------------------
function AuthModal({ onLoginSuccess }: { onLoginSuccess: (user: UserProfile) => void }) {
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "otp" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  // Secret Reset states
  const [resetCode, setResetCode] = useState("");
  const [enteredResetCode, setEnteredResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Clear messages on tab changes
  useEffect(() => {
    setErrorMessage("");
    setSuccessMsg("");
  }, [activeTab]);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("कृपया सभी फ़ील्ड भरें! (Please fill all fields)");
      return;
    }

    const user = dbInstance.getUserByEmail(email);
    if (!user) {
      setErrorMessage("यह ईमेल पंजीकृत नहीं है! (Email not registered)");
      return;
    }

    if (user.password !== password) {
      setErrorMessage("गलत पासवर्ड दर्ज किया गया! (Incorrect password)");
      return;
    }

    // Success
    setSuccessMsg("सफल लॉगिन! पावती लोडिंग...");
    setTimeout(() => {
      onLoginSuccess(user);
    }, 1000);
  };

  const handleGoogleLoginMock = () => {
    setErrorMessage("");
    // Standard mock user with Google details
    const emailMock = "vanshkumarv375@gmail.com";
    let user = dbInstance.getUserByEmail(emailMock);
    
    if (!user) {
      user = dbInstance.createUser("Vansh Kumar", emailMock, "9012345678", "google_oauth_secret");
    }

    setSuccessMsg("Google लॉगिन सफल! (Google SignIn Successful)");
    setTimeout(() => {
      onLoginSuccess(user!);
    }, 1200);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !email || !phone || !password) {
      setErrorMessage("कृपया सभी अनिवार्य फ़ील्ड भरें!");
      return;
    }

    const exist = dbInstance.getUserByEmail(email);
    if (exist) {
      setErrorMessage("यह ईमेल पहले से ही पंजीकृत है!");
      return;
    }

    const newUser = dbInstance.createUser(fullName, email, phone, password);
    setSuccessMsg("पंजीकरण सफल! खाता लॉगिन किया जा रहा है...");
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!phone || phone.length !== 10) {
      setErrorMessage("कृपया 10 अंकों का मान्य मोबाइल नंबर डालें!");
      return;
    }

    // Generate simulated 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setSuccessMsg(`Simulated OTP sent to ${phone}. Enter '${code}' to verify!`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (enteredOtp !== generatedOtp) {
      setErrorMessage("गलत ओटीपी! कृपया सही कोड दर्ज करें।");
      return;
    }

    // Find user by phone, or auto register
    let user = dbInstance.getUserByPhone(phone);
    if (!user) {
      // Auto register user
      const nameMock = `सदस्य-सैनिक (User ${phone.slice(-4)})`;
      const emailMock = `user_${phone}@pvp.org`;
      user = dbInstance.createUser(nameMock, emailMock, phone, "otp_password");
    }

    setSuccessMsg("ओटीपी सत्‍यापन सफल! (OTP Verified successfully)");
    setTimeout(() => {
      onLoginSuccess(user!);
    }, 1000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setErrorMessage("कृपया पंजीकृत ईमेल दर्ज करें!");
      return;
    }

    const user = dbInstance.getUserByEmail(email);
    if (!user) {
      setErrorMessage("यह ईमेल सर्वर पर पंजीकृत नहीं पाया गया!");
      return;
    }

    // Create debug reset code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setResetCode(mockCode);
    setSuccessMsg(`पासवर्ड रीसेट लिंक एवं वेरिफिकेशन कोड भेज दिया गया है। Code: '${mockCode}'`);
    setTimeout(() => {
      setActiveTab("reset");
    }, 2000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (enteredResetCode !== resetCode) {
      setErrorMessage("रीसेट पासवर्ड वेरिफिकेशन कोड गलत है!");
      return;
    }

    if (newPassword.length < 5) {
      setErrorMessage("नया पासवर्ड कम से कम 5 अक्षरों का होना चाहिए!");
      return;
    }

    // Reset user password
    const user = dbInstance.getUserByEmail(email);
    if (user) {
      dbInstance.updateUserProfile(user.uid, { password: newPassword });
      setSuccessMsg("पासवर्ड सफलतापूर्वक बदल दिया गया! कृपया अब लॉगिन करें।");
      setTimeout(() => {
        setActiveTab("login");
      }, 1500);
    } else {
      setErrorMessage("उपयोगकर्ता नहीं मिला!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[400px]">
      
      {/* Visual Column */}
      <div className="md:col-span-5 h-full hidden md:flex flex-col justify-between p-6 bg-ngo-dark text-[#efe7d6] rounded-2xl border border-ngo-forest/40">
        <div>
          <span className="text-xl">🌱</span>
          <h2 className="font-hindi text-2xl font-black mt-3">पश्चिमांचल स्वावलंबन पोर्टल</h2>
          <div className="w-12 h-1 bg-amber-400 my-4" />
          <p className="font-hindi text-sm text-stone-200 leading-relaxed font-semibold">
            अपनी मातृभूमि पश्चिमांचल की सेवा के लिए एक साझा मंच। सैनिक लॉगिन करके अपने द्वारा किए गए योगदान, जुड़े अभियानों व कर-छूट रसीदों को एक ही स्थान से डाउनलोड कर सकते हैं।
          </p>
        </div>
        
        <div className="border-t border-[#efe7d6]/20 pt-4 mt-6">
          <p className="font-hindi text-xs text-amber-300">
            "प्रकृतिः रक्षति रक्षिता" • Nature Protects Those Who Protect It.
          </p>
        </div>
      </div>

      {/* Forms Column */}
      <div className="md:col-span-7">
        
        {/* Toggle navigation labels */}
        {activeTab !== "reset" && activeTab !== "forgot" && (
          <div className="flex border-b border-stone-300 mb-6 gap-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-2.5 px-4 font-hindi text-lg font-extrabold cursor-pointer transition-all border-b-2 ${
                activeTab === "login" || activeTab === "otp"
                  ? "border-[#0f4d24] text-[#0f4d24]"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              लॉगिन (Sign In)
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`pb-2.5 px-4 font-hindi text-lg font-extrabold cursor-pointer transition-all border-b-2 ${
                activeTab === "signup"
                  ? "border-[#0f4d24] text-[#0f4d24]"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              नया खाता खोलें (Sign Up)
            </button>
          </div>
        )}

        {/* Global Messages info */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 text-sm font-hindi rounded-xl border border-red-300 flex items-center gap-2 font-semibold animate-pulse">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 text-sm font-hindi rounded-xl border border-emerald-300 flex items-center gap-2 font-semibold">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {activeTab === "login" && (
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div className="flex flex-col">
              <label className="font-hindi text-sm font-bold text-stone-800 mb-1">पंजीकृत ईमेल आईडी (Registered Email) *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ngo-forest"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <label className="font-hindi text-sm font-bold text-stone-800">पासवर्ड (Password) *</label>
                <button
                  type="button"
                  onClick={() => setActiveTab("forgot")}
                  className="text-xs text-ngo-forest font-bold hover:underline cursor-pointer"
                >
                  पासवर्ड भूल गए?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ngo-forest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f4d24] hover:bg-ngo-forest text-[#efe7d6] py-3 rounded-xl font-hindi text-base font-extrabold shadow hover:shadow-md transition-all cursor-pointer active:scale-[0.99] mt-2 block"
            >
              लॉगिन करें (Sign In Account)
            </button>

            {/* Alternates */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#f5f1e8] px-2 text-stone-500 font-bold font-hindi">अन्य विकल्प (Options)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("otp")}
                className="py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-850 hover:text-amber-900 border border-amber-500/30 rounded-xl text-xs font-hindi font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                मोबाईल नंबर ओटीपी लॉगिन (OTP)
              </button>
              <button
                type="button"
                onClick={handleGoogleLoginMock}
                className="py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.182-2.767-6.182-6.182 0-3.414 2.767-6.182 6.182-6.182 1.6 0 3.03.614 4.12 1.614l2.9-2.9C18.665 2.18 15.65 1 12.24 1C6.015 1 1 6.015 1 12.24s5.015 11.24 11.24 11.24c5.895 0 10.82-4.22 10.82-11.24 0-.768-.068-1.514-.194-2.24H12.24z"
                  />
                </svg>
                Google से लॉगिन करें
              </button>
            </div>
          </form>
        )}

        {/* 2. MOBILE NUMBER OTP LOGIN */}
        {activeTab === "otp" && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="flex flex-col">
                  <label className="font-hindi text-sm font-bold text-stone-800 mb-1">मोबाइल नंबर दर्ज करें (Enter Mobile Number) *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
                    <input
                      type="tel"
                      required
                      placeholder="9999999999"
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="flex-1 py-2.5 border border-stone-400 font-hindi font-bold hover:bg-stone-200 text-stone-700 rounded-xl text-sm transition-all cursor-pointer"
                  >
                    वापस जाएं (Back)
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-[#0f4d24] hover:bg-ngo-forest text-[#efe7d6] py-2.5 font-hindi font-extrabold rounded-xl text-sm shadow transition-all cursor-pointer text-center"
                  >
                    ओटीपी भेजें (Get OTP)
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex flex-col">
                  <label className="font-hindi text-sm font-bold text-stone-800 mb-1">6-अंकों का ओटीपी कोड दर्ज करें *</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
                    <input
                      type="text"
                      required
                      placeholder="जैसे '123456'"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm tracking-widest focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 py-2.5 border border-stone-400 font-hindi font-bold hover:bg-stone-200 text-stone-700 rounded-xl text-sm transition-all cursor-pointer"
                  >
                    नंबर बदलें
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 font-hindi font-extrabold rounded-xl text-sm shadow transition-all cursor-pointer"
                  >
                    ओटीपी सत्यापित करें (Verify & login)
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3. SIGNUP MODE */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="flex flex-col">
              <label className="font-hindi text-xs font-bold text-stone-800 mb-0.5">पूरा नाम (Full Name) *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  required
                  placeholder="अपना नाम दर्ज करें"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-hindi text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-hindi text-xs font-bold text-stone-800 mb-0.5">ईमेल (Email ID) *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-hindi text-xs font-bold text-stone-800 mb-0.5">मोबाइल नंबर (10 Digit Phone) *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="tel"
                  required
                  placeholder="जैसे: 9876543210"
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-hindi text-xs font-bold text-stone-800 mb-0.5">पासवर्ड बनाएं (Create Password) *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  placeholder="कम से कम 5 अक्षर"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f4d24] hover:bg-ngo-forest text-[#efe7d6] py-2.5 rounded-xl font-hindi text-base font-extrabold shadow hover:shadow-md transition-all cursor-pointer mt-3"
            >
              खाता बनाएं (Register Profile)
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD */}
        {activeTab === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <h3 className="font-hindi text-lg font-black text-stone-900 border-b pb-2">पारंपरिक सुरक्षा: पासवर्ड भूल गए?</h3>
            <p className="font-hindi text-xs text-stone-600 leading-normal mb-3">
              कृपया पंजीकृत ईमेल पता टाइप करें। हम आपको डेटाबेस से सुरक्षित वेरिफिकेशन कोड सिमुलेट करेंगे।
            </p>
            
            <div className="flex flex-col">
              <label className="font-hindi text-sm font-bold text-stone-800 mb-1">ईमेल एड्रेस (Registered Email) *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="flex-1 py-2.5 border border-stone-400 font-hindi font-bold hover:bg-stone-200 text-stone-700 rounded-xl text-center text-sm cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                className="flex-[2] bg-ngo-dark hover:bg-ngo-forest text-white py-2.5 font-hindi font-extrabold rounded-xl text-sm transition-all text-center cursor-pointer shadow"
              >
                वेरिफिकेशन कोड प्राप्त करें
              </button>
            </div>
          </form>
        )}

        {/* 5. RESET PASSWORD ACTION */}
        {activeTab === "reset" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <h3 className="font-hindi text-lg font-black text-[#0f4d24]">नया पासवर्ड रीसेट करें</h3>
            
            <div className="flex flex-col">
              <label className="font-hindi text-sm font-bold text-stone-800 mb-1">प्रदान किया गया 6-अंकीय कोड दर्ज करें *</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
                <input
                  type="text"
                  required
                  placeholder="वेरिफिकेशन कोड"
                  value={enteredResetCode}
                  onChange={(e) => setEnteredResetCode(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-hindi text-sm font-bold text-stone-800 mb-1">नया पासवर्ड बनाएं (New Password) *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
                <input
                  type="password"
                  required
                  placeholder="न्यूनतम 5 वर्ण"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#efe7d6]/40 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-hindi font-extrabold rounded-xl shadow transition-all cursor-pointer"
            >
              रीसेट एवं अपडेट पासवर्ड
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

// ----------------------------------------------------
// USER PROFILE DASHBOARD VIEW
// ----------------------------------------------------
function UserProfileView({ user, onLogout, onUpdate }: { user: UserProfile; onLogout: () => void; onUpdate: () => void }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [password, setPassword] = useState(user.password || "");
  const [isEditing, setIsEditing] = useState(false);
  
  const [personalDonations, setPersonalDonations] = useState<DonationRecord[]>([]);
  const [savedUserCampaigns, setSavedUserCampaigns] = useState<any[]>([]);

  useEffect(() => {
    // Filter donations belonging to this user
    const allDons = dbInstance.getDonations();
    const mine = allDons.filter(d => d.donorEmail.toLowerCase() === user.email.toLowerCase() || d.userId === user.uid);
    setPersonalDonations(mine);

    // Get joined campaigns
    const allCamps = dbInstance.getCampaigns();
    const joined = allCamps.filter(c => user.joinedCampaignIds.includes(c.id));
    setSavedUserCampaigns(joined);
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = dbInstance.updateUserProfile(user.uid, {
      fullName,
      phone,
      bio,
      password
    });
    if (updated) {
      localStorage.setItem("pvp_current_user", JSON.stringify(updated));
      setIsEditing(false);
      onUpdate();
      alert("प्रोफ़ाइल डेटा सफलतापूर्वक अपडेट किया गया! (Profile updated)");
    }
  };

  const downloadSingleReceipt = (receipt: DonationRecord) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>आयकर छूट दान रसीद - पश्चिमांचल विकास परिषद</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #f5f1e8; color: #1c1917; margin: 0; padding: 40px; }
    .certificate { border: 8px double #1b5025; padding: 40px; max-width: 700px; margin: 20px auto; background-color: #ffffff; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-radius: 8px; }
    .header { text-align: center; border-bottom: 2px dashed #e7e5e4; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 36px; margin-bottom: 8px; }
    .title-main { font-size: 26px; font-weight: 900; color: #0f4d24; margin: 0; }
    .title-sub { font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #78716c; margin: 5px 0 15px 0; }
    .cert-badge { background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 6px 16px; border-radius: 9999px; font-size: 13px; display: inline-block; font-weight: 700; }
    .body-content { line-height: 1.8; font-size: 15px; margin-bottom: 40px; }
    .grid-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
    .grid-table td { padding: 12px 10px; border-bottom: 1px solid #f5f5f4; }
    .grid-table td.label { color: #78716c; font-weight: 600; }
    .grid-table td.value { font-weight: 700; text-align: right; }
    .amount-box { background-color: #fdfcf7; border: 1px solid #efe7d6; padding: 15px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .amount-value { font-size: 26px; font-weight: 950; color: #0f4d24; }
    .footer-signs { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-text { font-size: 12px; color: #78716c; font-style: italic; }
    .sign-block { text-align: right; }
    .signature { font-size: 20px; font-weight: 700; color: #0f4d24; margin-bottom: 5px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">🌱</div>
      <h1 class="title-main">पश्चिमांचल विकास परिषद (भारत)</h1>
      <div class="title-sub">Paschimanchal Vikas Parishad (PVP)</div>
      <div class="cert-badge">80G आयकर दान प्रमाण-पत्र (DONATION RECEIPT)</div>
    </div>
    <div class="body-content">
      <p>सहर्ष प्रमाणित किया जाता है कि पर्यावरण संरक्षण, तालाब संवर्धन एवं सांस्कृतिक संवर्धन जन-अभियान हेतु निम्नलिखित दान राशि सफलतापूर्वक प्राप्त हुई है:</p>
      <table class="grid-table">
        <tr><td class="label">रसीद संख्या (Receipt Ref):</td><td class="value">${receipt.receiptId}</td></tr>
        <tr><td class="label">दाता का नाम (Donor Name):</td><td class="value">${receipt.donorName}</td></tr>
        <tr><td class="label">ईमेल पता (Email):</td><td class="value">${receipt.donorEmail}</td></tr>
        <tr><td class="label">पैन कार्ड (PAN Number):</td><td class="value">${receipt.pan}</td></tr>
        <tr><td class="label">दान की तिथि (Date):</td><td class="value">${receipt.date}</td></tr>
      </table>
      <div class="amount-box">
        <span class="label">कुल स्वीकृत दान राशि (Total Donated Amount):</span>
        <div class="amount-value">₹${receipt.amount.toLocaleString()}</div>
      </div>
    </div>
    <div class="footer-signs">
      <div class="footer-text">"प्रकृतिः रक्षति रक्षिता"</div>
      <div class="sign-block">
        <div class="signature">Nitin Swami</div>
        <div style="font-size: 14px; font-weight: 850;">(नितिन स्वामी)</div>
        <div style="font-size: 11px; color: #78716c;">राष्ट्रीय अध्यक्ष • पी.वी.प. (भारत)</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PVP_Receipt_${receipt.receiptId.replace(/\//g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header segment overlay */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ngo-dark text-[#efe7d6] p-6 rounded-2xl border border-ngo-forest/40">
        <div>
          <span className="bg-amber-400 text-ngo-dark font-hindi font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider select-none leading-none">सक्रिय सदस्य सैनिक (Volunteer User)</span>
          <h2 className="font-hindi text-2.5xl font-black mt-2">{user.fullName}</h2>
          <p className="font-sans text-xs text-stone-200 mt-1">{user.email} • Mobile: {user.phone}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-hindi font-bold cursor-pointer transition-colors shadow flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          लॉगआउट (Logout)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Edit Details inside profile view */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-md">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-hindi text-base font-black text-[#0f4d24]">सदस्य प्रोफ़ाइल (Information)</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-stone-500 hover:text-ngo-forest p-1 rounded hover:bg-stone-100 cursor-pointer"
              title="जानकारी बदलें"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-4 font-hindi">
              <div>
                <span className="text-stone-500 font-bold text-xs block">योगदानकर्ता का बायो</span>
                <p className="text-stone-800 text-sm font-semibold mt-1 leading-relaxed bg-[#fdfcf7] p-3 rounded-lg border border-stone-150">{user.bio || "कोई बायो उपलब्ध नहीं है।"}</p>
              </div>
              <div>
                <span className="text-stone-500 font-bold text-xs block">सदस्यता तिथि (Created Date)</span>
                <p className="text-stone-800 font-sans text-xs font-bold mt-0.5">{new Date(user.createdAt).toLocaleDateString("hi-IN")}</p>
              </div>
              {user.volunteeredPillars.length > 0 && (
                <div>
                  <span className="text-stone-500 font-bold text-xs block">सहबद्ध पर्यावरण सेना प्रभाग</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.volunteeredPillars.map((p, idx) => (
                      <span key={idx} className="bg-ngo-cream text-ngo-forest text-xs font-bold px-2 py-0.5 rounded border border-ngo-forest/20">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex flex-col">
                <label className="font-hindi text-xs font-bold text-stone-800 mb-1">पूरा नाम</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#efe7d6]/40 border border-stone-300 rounded-xl font-hindi text-xs focus:outline-none focus:border-ngo-forest"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-hindi text-xs font-bold text-stone-800 mb-1">मोबाइल नंबर</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#efe7d6]/40 border border-stone-300 rounded-xl font-sans text-xs focus:outline-none focus:border-ngo-forest"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-hindi text-xs font-bold text-stone-800 mb-1">बायो (संक्षेप में)</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#efe7d6]/40 border border-stone-300 rounded-xl font-hindi text-xs focus:outline-none focus:border-ngo-forest resize-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-hindi text-xs font-bold text-stone-800 mb-1">पासवर्ड</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#efe7d6]/40 border border-stone-300 rounded-xl font-sans text-xs focus:outline-none focus:border-ngo-forest"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-1.5 border border-stone-300 font-hindi rounded-lg text-xs hover:bg-stone-100 cursor-pointer text-stone-600 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-ngo-dark text-[#efe7d6] font-hindi rounded-lg text-xs hover:bg-ngo-forest cursor-pointer font-bold"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right side checklist: joined campaigns, previous 80G donations with receipt prints */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Campaigns checklists */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md">
            <h3 className="font-hindi text-base font-black text-[#0f4d24] pb-2 border-b border-stone-100 mb-3 flex items-center gap-1.5">
              <Folder className="w-5 h-5 text-emerald-600" />
              आपके समर्थित एवं पंजीकृत सामाजिक अभियान
            </h3>
            {savedUserCampaigns.length === 0 ? (
              <p className="font-hindi text-xs text-stone-500 py-3 italic">
                आपने अभी तक कोई भी अभियान प्रतिज्ञा में भाग नहीं लिया है। मुख्य पोर्टल पर "अभियान" सेक्शन पर जाकर प्रतिज्ञा लें!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedUserCampaigns.map((camp) => (
                  <div key={camp.id} className="p-3 bg-[#efe7d6]/20 border border-stone-200 rounded-xl flex items-center justify-between gap-2.5">
                    <div>
                      <h4 className="font-hindi text-xs font-extrabold text-stone-900 leading-normal">{camp.titleHindi}</h4>
                      <p className="text-[10px] font-sans text-stone-500">{camp.titleEnglish}</p>
                    </div>
                    <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold font-hindi px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      समर्थित
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Donations checklist */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md">
            <h3 className="font-hindi text-base font-black text-[#0f4d24] pb-2 border-b border-stone-100 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 text-emerald-600" />
                आपका दान सहयोग इतिहास एवं आयकर छूट 80G प्रमाण-पत्र
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-sans font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                Contributions: {personalDonations.length}
              </span>
            </h3>

            {personalDonations.length === 0 ? (
              <p className="font-hindi text-xs text-stone-500 py-4 italic">
                इस ईमेल आईडी के अंतर्गत परिषद को कोई दान प्राप्त होना दर्ज नहीं है। यदि आप सहयोग करना चाहते हैं, तो कृपया होमपेज के सहयोग निधि अनुभाग पर जाएं।
              </p>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {personalDonations.map((receipt, idx) => (
                  <div key={idx} className="p-3.5 bg-[#fdfcf7] hover:bg-[#faf9f3] border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <span className="font-sans font-bold text-sm text-[#0f4d24]">₹{receipt.amount.toLocaleString()}</span>
                        <span className="font-hindi bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 px-2 py-0.2 rounded">सफल</span>
                      </div>
                      <p className="text-[10px] font-sans text-stone-400">Ref: {receipt.receiptId} • PAN: {receipt.pan}</p>
                      <p className="font-hindi text-[10px] text-stone-500">तिथि: {receipt.date}</p>
                    </div>
                    <button
                      onClick={() => downloadSingleReceipt(receipt)}
                      className="px-4 py-1.5 bg-ngo-dark hover:bg-ngo-forest text-[#efe7d6] rounded-lg text-xs font-hindi font-bold cursor-pointer transition-colors shadow flex items-center justify-center gap-1 w-full sm:w-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      रसीद डाउनलोड (HTML/Print)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// UNIVERSAL COMPRESSED IMAGE UPLOADER COMPONENT
// ----------------------------------------------------
function ImageUploader({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (base64: string) => void; 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const valid = ["image/jpeg", "image/png", "image/webp"];
    if (!valid.includes(file.type)) {
      alert("अमान्य फ़ाइल प्रकार! केवल JPG, PNG या WEBP अपलोड करें।");
      return;
    }
    const reader = new FileReader();
    reader.onload = (re) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          }
        } else {
          if (height > MAX) {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.75);
          onChange(compressed);
          setPreview(compressed);
        }
      };
      img.src = re.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold text-stone-700 block">{label}</span>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
          }
        }}
        className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center transition-all min-h-[110px] ${
          dragActive ? "border-amber-500 bg-amber-500/5" : "border-stone-300 hover:border-[#0f4d24] hover:bg-stone-50"
        }`}
      >
        {preview ? (
          <div className="relative w-full aspect-video max-h-[140px] bg-stone-100 flex items-center justify-center rounded-lg overflow-hidden group border">
            <img src={preview} alt="Upload Preview" className="h-full object-contain" />
            <button
              type="button"
              onClick={() => {
                onChange("");
                setPreview("");
              }}
              className="absolute top-1.5 right-1.5 bg-red-650 hover:bg-red-705 text-[#efe7d6] p-1.5 rounded-lg text-xs cursor-pointer shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              हटाएं (Remove)
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer py-4 px-2 text-center w-full h-full">
            <Upload className="w-6 h-6 text-stone-500 mb-1" />
            <span className="text-xs font-hindi font-bold text-stone-700">चित्र खींचकर लाएं या बदलें (Drag & Drop)</span>
            <span className="text-[10px] text-stone-500 font-sans mt-0.5">JPG, PNG, WEBP (Auto-Compressed)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SECURE ADMIN DASHBOARD PANEL (FULL CONTROL ERP)
// ----------------------------------------------------
type AdminTab = "donations" | "campaigns" | "gallery" | "news" | "team_members" | "volunteers" | "cms_sections";

function AdminDashboard({ user, onLogout, onClose }: { user: UserProfile; onLogout: () => void; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("volunteers");
  
  // Datasets
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  // CMS State
  const [cmsSubTab, setCmsSubTab] = useState<"hero" | "about" | "pillars" | "president" | "website" | "links">("hero");
  const [siteContentState, setSiteContentState] = useState(dbInstance.getSiteContent());
  const [pillarsState, setPillarsState] = useState(dbInstance.getPillars());
  const [editingPillarId, setEditingPillarId] = useState<string | null>(null);

  // Edit states for lists
  const [editingItem, setEditingItem] = useState<{ id: string; type: string; data: any } | null>(null);
  const [editingItemInput, setEditingItemInput] = useState<any>(null);

  const handleCmsFieldChange = (key: keyof typeof siteContentState, val: string) => {
    setSiteContentState((prev) => ({ ...prev, [key]: val }));
  };

  // Search keyword filters
  const [searchQuery, setSearchQuery] = useState("");

  // Loading datasets triggers
  const loadAllData = () => {
    setDonations(dbInstance.getDonations());
    setCampaigns(dbInstance.getCampaigns());
    setGallery(dbInstance.getGallery());
    setNews(dbInstance.getNews());
    setTeam(dbInstance.getTeam());
    setVolunteers(dbInstance.getVolunteers());
    setSiteContentState(dbInstance.getSiteContent());
    setPillarsState(dbInstance.getPillars());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Creation Fields
  const [showAddModal, setShowAddModal] = useState(false);

  // Dynamic Add State depending on tab
  // Campaigns additions
  const [campTitleHi, setCampTitleHi] = useState("");
  const [campTitleEn, setCampTitleEn] = useState("");
  const [campSubHi, setCampSubHi] = useState("");
  const [campSubEn, setCampSubEn] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campImg, setCampImg] = useState("");

  // Gallery additions
  const [galUrl, setGalUrl] = useState("");
  const [galTitle, setGalTitle] = useState("");
  const [galCategory, setGalCategory] = useState("Ground Activities");
  const [galPreview, setGalPreview] = useState("");
  const [galGeneratedPath, setGalGeneratedPath] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // News additions
  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory, setNewsCategory] = useState("जल अभियान");
  const [newsSummary, setNewsSummary] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImg, setNewsImg] = useState("");

  // Team Member additions
  const [teamName, setTeamName] = useState("");
  const [teamNameHi, setTeamNameHi] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamRoleHi, setTeamRoleHi] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [teamImg, setTeamImg] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("अमान्य फ़ाइल प्रकार! कृपया केवल JPG, PNG या WEBP चित्र अपलोड करें। (Invalid file type! Please upload only JPG, PNG or WEBP images.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.75);
          setGalUrl(compressed);
          setGalPreview(compressed);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Generate safe mock path
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "_");
    const generated = `/src/assets/images/gallery_${Date.now()}_${safeName}`;
    setGalGeneratedPath(generated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "campaigns") {
        if (!campTitleHi || !campTitleEn || !campDesc) return;
        dbInstance.addCampaign({
          titleHindi: campTitleHi,
          titleEnglish: campTitleEn,
          subtitleHindi: campSubHi,
          subtitleEnglish: campSubEn,
          description: campDesc,
          imageUrl: campImg || "/src/assets/images/river_march_stones.png"
        });
        setCampTitleHi(""); setCampTitleEn(""); setCampSubHi(""); setCampSubEn(""); setCampDesc(""); setCampImg("");
      } else if (activeTab === "gallery") {
        if (!galUrl || !galTitle) {
          alert("कृपया एक चित्र अपलोड करें और शीर्षक दर्ज करें! (Please upload an image and enter a title!)");
          return;
        }
        dbInstance.addGalleryImage({
          url: galUrl,
          title: galTitle,
          category: galCategory
        });
        setGalUrl("");
        setGalTitle("");
        setGalPreview("");
        setGalGeneratedPath("");
      } else if (activeTab === "news") {
        if (!newsTitle || !newsContent || !newsSummary) return;
        dbInstance.addNews({
          title: newsTitle,
          date: new Date().toISOString().split('T')[0],
          category: newsCategory,
          summary: newsSummary,
          content: newsContent,
          imageUrl: newsImg || "/src/assets/images/yatra_crowd_night.png"
        });
        setNewsTitle(""); setNewsSummary(""); setNewsContent(""); setNewsImg("");
      } else if (activeTab === "team_members") {
        if (!teamName || !teamNameHi || !teamRole || !teamRoleHi) return;
        dbInstance.addTeamMember({
          name: teamName,
          nameHindi: teamNameHi,
          role: teamRole,
          roleHindi: teamRoleHi,
          bio: teamBio,
          imageUrl: teamImg || "/src/assets/images/nitin_swami_1780203516611.png",
          socials: { facebook: "#", twitter: "#" }
        });
        setTeamName(""); setTeamNameHi(""); setTeamRole(""); setTeamRoleHi(""); setTeamBio(""); setTeamImg("");
      }
      
      setShowAddModal(false);
      loadAllData();
      alert("मद सफलतापूर्वक जोड़ा गया! (Item Successfully Added)");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm("क्या आप इसे स्थायी रूप से हटाना चाहते हैं? (Confirm Delete?)")) return;
    
    if (activeTab === "volunteers") {
      dbInstance.deleteVolunteer(id);
    } else if (activeTab === "donations") {
      dbInstance.deleteDonation(id);
    } else if (activeTab === "campaigns") {
      dbInstance.deleteCampaign(id);
    } else if (activeTab === "gallery") {
      dbInstance.deleteGalleryImage(id);
    } else if (activeTab === "news") {
      dbInstance.deleteNews(id);
    } else if (activeTab === "team_members") {
      dbInstance.deleteTeamMember(id);
    }

    loadAllData();
  };

  const handleStartEditing = (type: string, data: any) => {
    setEditingItem({ id: data.id, type, data });
    setEditingItemInput({ ...data });
  };

  const handleSaveEditedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItemInput) return;

    if (editingItem.type === "campaign") {
      dbInstance.updateCampaign(editingItemInput);
      alert("जन-अभियान सफलतापूर्वक संशोधित किया गया!");
    } else if (editingItem.type === "news") {
      dbInstance.updateNews(editingItemInput);
      alert("समाचार / मीडिया रिपोर्ट सफलतापूर्वक संशोधित किया गया!");
    } else if (editingItem.type === "gallery") {
      dbInstance.updateGalleryImage(editingItemInput);
      alert("गैलरी चित्र व शीर्षक विवरण सफलतापूर्वक संशोधित किया गया!");
    } else if (editingItem.type === "team_members") {
      dbInstance.updateTeamMember(editingItemInput);
      alert("परिषद अधिकारी मंडल सदस्य विवरण संशोधित किया गया!");
    }

    setEditingItem(null);
    setEditingItemInput(null);
    loadAllData();
  };

  // Filters logic
  const filteredVolunteers = volunteers.filter(v => 
    v.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.branch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDonations = donations.filter(d => 
    d.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.donorEmail?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.pan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.receiptId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = campaigns.filter(c => 
    c.titleHindi?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.titleEnglish?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = news.filter(n => 
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Admin Panel Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-900 text-[#efe7d6] p-6 rounded-3xl border-4 border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-hindi font-black tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            PVP भारत • केंद्रीय नियंत्रण कक्ष (ERP Enterprise Admin)
          </div>
          <h2 className="font-hindi text-2.5xl font-black mt-2">प्रशासक डैशबोर्ड (Secure Admin Console)</h2>
          <p className="font-sans text-xs text-stone-300 mt-1">स्वागत है, Vansh Tomar {user.email}</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              dbInstance.initializeDefaultData(true);
              loadAllData();
              alert("डिफ़ॉल्ट डेटा पुनर्स्थापित किया गया!");
            }}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-750 text-amber-400 rounded-xl text-xs font-hindi font-bold cursor-pointer border border-stone-700 hover:border-amber-500/30 transition-all"
            title="डिफ़ॉल्ट डेटा रीसेट करें"
          >
            डेटा रीसेट (Reset Default Data)
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-hindi font-bold cursor-pointer transition-colors shadow flex items-center justify-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            प्रस्थान (Sign Out)
          </button>
        </div>
      </div>

      {/* Main Panel Content split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 bg-white p-4 rounded-2.5xl border border-stone-200 shadow-md">
          
          <button
            onClick={() => { setActiveTab("volunteers"); setSearchQuery(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-hindi text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "volunteers" ? "bg-amber-500/15 text-amber-950 shadow-inner" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <User className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
            स्वयंसेवक व्यवस्था ({volunteers.length})
          </button>

          <button
            onClick={() => { setActiveTab("donations"); setSearchQuery(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-hindi text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "donations" ? "bg-amber-500/15 text-amber-950 shadow-inner" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Heart className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
            दान कोषागार ({donations.length})
          </button>

          <button
            onClick={() => { setActiveTab("campaigns"); setSearchQuery(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-hindi text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "campaigns" ? "bg-amber-500/15 text-amber-950 shadow-inner" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Folder className="w-4.5 h-4.5 text-blue-600 flex-shrink-0" />
            अभियान नियंत्रण ({campaigns.length})
          </button>

          <button
            onClick={() => { setActiveTab("news"); setSearchQuery(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-hindi text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "news" ? "bg-amber-500/15 text-amber-950 shadow-inner" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5 text-purple-600 flex-shrink-0" />
            समाचार व मीडिया ({news.length})
          </button>

          <button
            onClick={() => { setActiveTab("gallery"); setSearchQuery(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-hindi text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "gallery" ? "bg-amber-500/15 text-amber-950 shadow-inner" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Image className="w-4.5 h-4.5 text-emerald-600 display-inline-block flex-shrink-0" />
            गैलरी चित्रशाला ({gallery.length})
          </button>

          <button
            onClick={() => { setActiveTab("team_members"); setSearchQuery(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-hindi text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "team_members" ? "bg-amber-500/15 text-amber-950 shadow-inner" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Briefcase className="w-4.5 h-4.5 text-orange-600 flex-shrink-0" />
            परिषद कार्यकर्ता ({team.length})
          </button>

          <button
            onClick={() => { setActiveTab("cms_sections"); setSearchQuery(""); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-hindi text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
              activeTab === "cms_sections" ? "bg-amber-500/15 text-amber-950 shadow-inner border border-amber-500/30" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Settings className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
            वेबसाइट सामग्री (CMS Settings)
          </button>

        </div>

        {/* Console working spreadsheet workspace */}
        <div className="lg:col-span-9 bg-white p-5 rounded-3xl border border-stone-200 shadow-md flex flex-col min-h-[500px]">
          
          {/* Working Title Search bar & Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-stone-100 pb-4 mb-4">
            <div>
              <h3 className="font-hindi text-lg font-black text-stone-900 uppercase">
                {activeTab === "volunteers" && "पर्यावरण सैनिक पंजी (Registered Volunteers)"}
                {activeTab === "donations" && "सहयोग निधि रसीद बही (Total Donation Ledgers)"}
                {activeTab === "campaigns" && "सक्रिय जन-अभियान (Website Campaigns)"}
                {activeTab === "news" && "प्रेस नोट व मीडिया (News Articles)"}
                {activeTab === "gallery" && "साइट गैलरी एल्बम (Site Photo Gallery)"}
                {activeTab === "team_members" && "अधिकारी / कार्यकर्ता मंडल (Team roster)"}
                {activeTab === "cms_sections" && "वेबसाइट दृश्य सामग्री प्रबंधन (Visual CMS Control)"}
              </h3>
              <p className="font-hindi text-xs text-stone-500 mt-1">
                {activeTab === "cms_sections" ? "वेबसाइट के किसी भी भाग के पाठ, चित्रों अथवा सोशल मीडिया लिंक को बिना कोडिंग के बदलें।" : "विद्यमान डाटाबेस में संवर्धन, विलोपन या संशोधन करें।"}
              </p>
            </div>

            {activeTab !== "cms_sections" && (
              <div className="flex gap-2 items-center">
                {/* Search label */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="खोजें... (Search...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-350 focus:border-[#0f4d24] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#0f4d24]"
                  />
                </div>

                {/* Add buttons ONLY for non-volunteer, non-donation dynamic arrays */}
                {activeTab !== "volunteers" && activeTab !== "donations" && (
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="px-3 py-1.5 bg-[#0f4d24] hover:bg-ngo-forest text-[#efe7d6] rounded-xl text-xs font-hindi font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    जोड़ें (Add New)
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-x-auto">
            
            {/* VOLUNTEERS SHEET PANEL */}
            {activeTab === "volunteers" && (
              <table className="w-full text-left text-xs font-hindi border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                    <th className="p-3">स्वयंसेवक आईडी</th>
                    <th className="p-3">सैनिक का नाम</th>
                    <th className="p-3">संपर्क</th>
                    <th className="p-3">जिला/शहर</th>
                    <th className="p-3">प्रभाग कार्य</th>
                    <th className="p-3 text-right">सफाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredVolunteers.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-stone-450 italic">कोई सैनिक नहीं मिला!</td></tr>
                  ) : (
                    filteredVolunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-3 font-sans font-extrabold text-[#0f4d24]">{vol.id}</td>
                        <td className="p-3 font-bold text-stone-900">{vol.fullName}</td>
                        <td className="p-3">
                          <p className="font-sans font-semibold">{vol.phone}</p>
                          <p className="font-sans text-[10px] text-stone-400">{vol.email || "N/A"}</p>
                        </td>
                        <td className="p-3 font-semibold">{vol.city}</td>
                        <td className="p-3">
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 px-2 py-0.5 rounded">{vol.branch}</span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteItem(vol.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* DONATIONS SHEET PANEL */}
            {activeTab === "donations" && (
              <table className="w-full text-left text-xs font-hindi border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                    <th className="p-3">रसीद संख्या</th>
                    <th className="p-3">दाता का नाम</th>
                    <th className="p-3">विवरण / ईमेल</th>
                    <th className="p-3">पैन कार्ड</th>
                    <th className="p-3 text-right">राशि (INR)</th>
                    <th className="p-3 text-right">हटाएं</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredDonations.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-stone-450 italic">रसीद बही खाली है!</td></tr>
                  ) : (
                    filteredDonations.map((don) => (
                      <tr key={don.receiptId} className="hover:bg-stone-50 transition-colors">
                        <td className="p-3 font-sans font-bold text-[#0f4d24]">{don.receiptId}</td>
                        <td className="p-3 font-bold text-stone-900">{don.donorName}</td>
                        <td className="p-3">
                          <p className="font-sans text-[11px] text-stone-500">{don.donorEmail}</p>
                          <p className="text-[10px] text-stone-400">{don.date}</p>
                        </td>
                        <td className="p-3 font-sans font-extrabold text-stone-600">{don.pan}</td>
                        <td className="p-3 font-sans font-black text-right text-[#0f4d24] text-sm">₹{don.amount.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteItem(don.receiptId)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* CAMPAIGNS SHEET PANEL */}
            {activeTab === "campaigns" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCampaigns.map((camp) => (
                  <div key={camp.id} className="p-4 border border-stone-200 rounded-2xl bg-[#fdfcf7] flex items-start gap-3 relative shadow-sm hover:shadow-md transition-shadow">
                    <img src={camp.imageUrl} alt={camp.titleHindi} className="w-16 h-16 object-cover rounded-lg border shrink-0" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-hindi text-sm font-black text-stone-900 pr-14">{camp.titleHindi}</h4>
                      <p className="text-[10px] font-sans text-stone-500 pr-14">{camp.titleEnglish}</p>
                      <p className="font-hindi text-[11px] text-stone-600 line-clamp-2 leading-relaxed">{camp.description}</p>
                      <span className="inline-block text-[10px] bg-sky-50 text-sky-800 border px-1.5 py-0.2 rounded font-sans font-extrabold">Pledges: {camp.pledgedCount}</span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditing("campaign", camp)}
                        className="text-amber-650 hover:text-amber-800 hover:bg-stone-100 p-1 rounded cursor-pointer"
                        title="संपादित करें (Edit)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(camp.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-stone-100 p-1 rounded cursor-pointer"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NEWS SHEET PANEL */}
            {activeTab === "news" && (
              <div className="space-y-4">
                {filteredNews.map((newsItem) => (
                  <div key={newsItem.id} className="p-4 border border-stone-200 rounded-2xl bg-[#fdfcf7] flex gap-3 relative shadow-sm hover:shadow-md transition-shadow">
                    <img src={newsItem.imageUrl} alt={newsItem.title} className="w-20 h-20 object-cover rounded-lg border shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2 items-center">
                        <span className="font-hindi bg-purple-50 text-purple-800 border px-2 py-0.2 rounded text-[10px] font-bold">{newsItem.category}</span>
                        <span className="font-sans text-[10px] text-stone-400">{newsItem.date}</span>
                      </div>
                      <h4 className="font-hindi text-sm font-black text-stone-900 leading-snug pr-14">{newsItem.title}</h4>
                      <p className="font-hindi text-xs text-stone-600 line-clamp-2">{newsItem.content}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditing("news", newsItem)}
                        className="text-amber-655 hover:text-amber-800 hover:bg-stone-50 p-1.5 rounded cursor-pointer"
                        title="संपादित करें (Edit)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(newsItem.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-stone-50 p-1.5 rounded cursor-pointer h-ma self-start"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* GALLERY SHEET PANEL */}
            {activeTab === "gallery" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((img) => (
                  <div key={img.id} className="relative group rounded-2xl border overflow-hidden bg-stone-50 shadow-sm hover:shadow-md transition-shadow">
                    <img src={img.url} alt={img.title} className="w-full h-24 object-cover" />
                    <div className="p-2 space-y-1 bg-white">
                      <h5 className="font-hindi text-[10px] font-bold text-stone-900 line-clamp-1 leading-none">{img.title}</h5>
                      <span className="text-[8px] font-sans text-stone-400">{img.category}</span>
                    </div>
                    <div className="absolute top-1.5 right-1.5 flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditing("gallery", img)}
                        className="bg-amber-500 text-stone-950 hover:bg-amber-600 p-1.5 rounded shadow cursor-pointer transition-colors"
                        title="संपादित करें (Edit)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(img.id)}
                        className="bg-red-600 text-white hover:bg-red-700 p-1.5 rounded shadow cursor-pointer transition-colors"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TEAM MEMBERS PANEL */}
            {activeTab === "team_members" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.map((member) => (
                  <div key={member.id} className="p-4 border border-stone-200 rounded-2xl bg-[#fdfcf7] flex gap-3 relative shadow-sm hover:shadow-md transition-shadow">
                    <img src={member.imageUrl} alt={member.name} className="w-14 h-14 object-cover rounded-full border shrink-0" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-hindi text-sm font-black text-stone-900 pr-14">{member.nameHindi} <span className="font-sans text-xs text-stone-500 font-normal">({member.name})</span></h4>
                      <p className="font-hindi text-xs text-stone-600 font-bold">{member.roleHindi} / {member.role}</p>
                      <p className="font-hindi text-[11px] text-stone-500 line-clamp-2">{member.bio || "कोई बायो नहीं है।"}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditing("team_members", member)}
                        className="text-amber-655 hover:text-amber-850 hover:bg-stone-100 p-1 rounded cursor-pointer"
                        title="संपादित करें (Edit)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(member.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded cursor-pointer"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CMS SECTIONS PANEL */}
            {activeTab === "cms_sections" && (
              <div className="space-y-6 font-hindi" id="cms-dashboard">
                {/* CMS Sub-navigation tabs */}
                <div className="flex flex-wrap border-b border-stone-200 pb-2 gap-2 text-xs sm:text-sm font-bold">
                  {[
                    { id: "hero", label: "नारे व मुख्य भाग (Hero)" },
                    { id: "about", label: "परिचय (About Us)" },
                    { id: "pillars", label: "सप्त स्तंभ (07 Pillars)" },
                    { id: "president", label: "अध्यक्षीय विचार (President Msg)" },
                    { id: "website", label: "साइट सेटिंग्स (Identity)" },
                    { id: "links", label: "संपर्क व कड़ियां (Contacts)" },
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      type="button"
                      onClick={() => setCmsSubTab(subTab.id as any)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        cmsSubTab === subTab.id
                          ? "bg-[#0f4d24] text-[#efe7d6] border-[#0f4d24]"
                          : "bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-300"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {/* Sub-tab 1: HERO CONFIG */}
                {cmsSubTab === "hero" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      dbInstance.saveSiteContent(siteContentState);
                      alert("मुख्य नारे व संदेश सेटिंग्स सहेज दी गईं!");
                      loadAllData();
                    }}
                    className="space-y-4 text-xs sm:text-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">मुख्य शीर्षक (Hero Title)</label>
                        <input
                          type="text"
                          value={siteContentState.heroTitle}
                          onChange={(e) => handleCmsFieldChange("heroTitle", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">उप-शीर्षक (Hero Subtitle)</label>
                        <input
                          type="text"
                          value={siteContentState.heroSubtitle}
                          onChange={(e) => handleCmsFieldChange("heroSubtitle", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">मुख्य नारा (Slogan/Sutra)</label>
                        <input
                          type="text"
                          value={siteContentState.heroSlogan}
                          onChange={(e) => handleCmsFieldChange("heroSlogan", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">बटन का पाठ (Button Text)</label>
                        <input
                          type="text"
                          value={siteContentState.heroBtnText}
                          onChange={(e) => handleCmsFieldChange("heroBtnText", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col flex-grow">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 font-sans">
                          पृष्ठभूमि वीडियो URL (Hero Video URL - Leave blank for image)
                        </label>
                        <input
                          type="text"
                          value={siteContentState.heroVideoUrl}
                          onChange={(e) => handleCmsFieldChange("heroVideoUrl", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">अध्यक्ष पद संक्षिप्त नाम</label>
                        <input
                          type="text"
                          value={siteContentState.heroPresidentName}
                          onChange={(e) => handleCmsFieldChange("heroPresidentName", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    {/* Image uploads for Hero using base64 processed FileReader */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ImageUploader
                        label="अध्यक्षीय संक्षिप्त चित्र (President Small Image)"
                        value={siteContentState.heroPresidentImg}
                        onChange={(base64) => handleCmsFieldChange("heroPresidentImg", base64)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0f4d24] text-[#efe7d6] rounded-xl font-hindi font-bold hover:bg-ngo-forest transition-colors flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      नारे व मुख्य सेटिंग सहेजें (Save Hero Settings)
                    </button>
                  </form>
                )}

                {/* Sub-tab 2: ABOUT CONFIG */}
                {cmsSubTab === "about" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      dbInstance.saveSiteContent(siteContentState);
                      alert("परिचय व चित्रकला सेटिंग्स सहेज दी गईं!");
                      loadAllData();
                    }}
                    className="space-y-4 text-xs sm:text-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">परिचय मुख्य बैज (Badge)</label>
                        <input
                          type="text"
                          value={siteContentState.aboutBadge}
                          onChange={(e) => handleCmsFieldChange("aboutBadge", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">परिचय मुख्य शीर्षक (Title)</label>
                        <input
                          type="text"
                          value={siteContentState.aboutTitle}
                          onChange={(e) => handleCmsFieldChange("aboutTitle", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    {/* About paragraph inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">परिचय पैराग्राफ १ (Paragraph 1)</label>
                        <textarea
                          rows={2}
                          value={siteContentState.aboutText1}
                          onChange={(e) => handleCmsFieldChange("aboutText1", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">परिचय पैराग्राफ २ (Paragraph 2)</label>
                        <textarea
                          rows={2}
                          value={siteContentState.aboutText2}
                          onChange={(e) => handleCmsFieldChange("aboutText2", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">परिचय पैराग्राफ ३ (Paragraph 3)</label>
                        <textarea
                          rows={2}
                          value={siteContentState.aboutText3}
                          onChange={(e) => handleCmsFieldChange("aboutText3", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                    </div>

                    {/* Quote section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">अंतिम कोट कथन (Quote message)</label>
                        <textarea
                          rows={2}
                          value={siteContentState.aboutQuote}
                          onChange={(e) => handleCmsFieldChange("aboutQuote", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">कोट प्रेषक (Quote Author)</label>
                        <input
                          type="text"
                          value={siteContentState.aboutQuoteAuthor}
                          onChange={(e) => handleCmsFieldChange("aboutQuoteAuthor", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none mt-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">चेतावनी संदेश कैप्शन (Warning Text)</label>
                        <input
                          type="text"
                          value={siteContentState.aboutWarningText}
                          onChange={(e) => handleCmsFieldChange("aboutWarningText", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">चेतावनी विवरण (Warning Details)</label>
                        <textarea
                          rows={2}
                          value={siteContentState.aboutText4}
                          onChange={(e) => handleCmsFieldChange("aboutText4", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                    </div>

                    {/* About Us replacement images */}
                    <div className="bg-stone-100 p-4 rounded-2xl border space-y-4">
                      <h4 className="font-bold text-stone-900 font-hindi border-b pb-2 mb-2">परिचय चित्रशाला (About Images)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ImageUploader
                          label="परिचय चित्र १ (Image 1)"
                          value={siteContentState.aboutImg1}
                          onChange={(base64) => handleCmsFieldChange("aboutImg1", base64)}
                        />
                        <ImageUploader
                          label="परिचय चित्र २ (Image 2)"
                          value={siteContentState.aboutImg2}
                          onChange={(base64) => handleCmsFieldChange("aboutImg2", base64)}
                        />
                        <ImageUploader
                          label="परिचय चित्र ३ (Image 3)"
                          value={siteContentState.aboutImg3}
                          onChange={(base64) => handleCmsFieldChange("aboutImg3", base64)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0f4d24] text-[#efe7d6] rounded-xl font-hindi font-bold hover:bg-ngo-forest transition-colors flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      परिचय व चित्रकला सेटिंग्स सहेजें (Save About Settings)
                    </button>
                  </form>
                )}

                {/* Sub-tab 3: SEVEN PILLARS CONFIG */}
                {cmsSubTab === "pillars" && (
                  <div className="space-y-4">
                    <div className="border bg-amber-500/5 p-4 rounded-2xl">
                      <p className="text-stone-700 text-xs sm:text-sm font-semibold leading-relaxed">
                        पश्चिमांचल विकास परिषद के सात संकल्प स्तंभों को नियंत्रित व परिवर्तित करें। अपनी इच्छानुसार शीर्षक, अंग्रेजी अनुवाद, या Lucide आइकॉन बदलें।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pillarsState.map((pillar) => (
                        <div key={pillar.id} className="p-4 border rounded-2xl bg-stone-50 space-y-3 shadow-inner relative">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-xs font-sans font-bold text-emerald-700 uppercase">Pillar {pillar.number} (संकल्प स्तम्भ)</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (editingPillarId === pillar.id) {
                                  setEditingPillarId(null);
                                } else {
                                  setEditingPillarId(pillar.id);
                                }
                              }}
                              className="px-2.5 py-1 text-[10px] bg-stone-200 text-stone-800 hover:bg-stone-300 transition-colors font-hindi font-bold cursor-pointer rounded-lg"
                            >
                              {editingPillarId === pillar.id ? "बंद करें (Close)" : "संपादित करें (Edit)"}
                            </button>
                          </div>

                          <div className="flex gap-3 items-center">
                            <span className="px-3 py-2 bg-amber-100 text-amber-950 font-black text-xl rounded-xl">{pillar.number}</span>
                            <div>
                              <h4 className="font-hindi text-base font-extrabold text-stone-900 leading-none">{pillar.title}</h4>
                              <p className="text-xs text-stone-500 italic font-sans mt-1">{pillar.titleEn}</p>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 font-hindi font-semibold line-clamp-2 italic pr-4 pl-1">{pillar.description}</p>

                          {editingPillarId === pillar.id && (
                            <div className="bg-white p-3 rounded-xl border space-y-3 font-hindi text-xs sm:text-sm pt-4 border-dashed border-stone-300">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col">
                                  <label className="font-bold text-stone-700 text-[11px] mb-1">शीर्षक (Hindi) *</label>
                                  <input
                                    type="text"
                                    value={pillar.title}
                                    onChange={(e) => {
                                      const updated = pillarsState.map(p => p.id === pillar.id ? { ...p, title: e.target.value } : p);
                                      setPillarsState(updated);
                                    }}
                                    className="px-2 py-1.5 border rounded-lg outline-none text-xs"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="font-bold text-stone-700 text-[11px] mb-1">English Translation</label>
                                  <input
                                    type="text"
                                    value={pillar.titleEn}
                                    onChange={(e) => {
                                      const updated = pillarsState.map(p => p.id === pillar.id ? { ...p, titleEn: e.target.value } : p);
                                      setPillarsState(updated);
                                    }}
                                    className="px-2 py-1.5 border rounded-lg outline-none text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col">
                                  <label className="font-bold text-stone-700 text-[11px] mb-1">आइकॉन नाम (Lucide Object) *</label>
                                  <select
                                    value={pillar.iconName}
                                    onChange={(e) => {
                                      const updated = pillarsState.map(p => p.id === pillar.id ? { ...p, iconName: e.target.value } : p);
                                      setPillarsState(updated);
                                    }}
                                    className="px-2 py-1.5 bg-stone-50 border rounded-lg text-xs"
                                  >
                                    <option value="Droplet">Droplet (जल)</option>
                                    <option value="Trees">Trees (प्रकृति/जंगल)</option>
                                    <option value="Heart">Heart (स्नेह व सेवा)</option>
                                    <option value="BookOpen">BookOpen (शिक्षा)</option>
                                    <option value="Shield">Shield (सुरक्षा)</option>
                                    <option value="Activity">Activity (आरोग्य)</option>
                                    <option value="Flame">Flame (ऊर्जा)</option>
                                    <option value="Award">Award (प्रसिद्धि)</option>
                                    <option value="HelpCircle">Help Circle</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex flex-col">
                                <label className="font-bold text-stone-700 text-[11px] mb-1">संकल्प स्तंभ का संदेश विवरण (Description) *</label>
                                <textarea
                                  rows={3}
                                  value={pillar.description}
                                  onChange={(e) => {
                                    const updated = pillarsState.map(p => p.id === pillar.id ? { ...p, description: e.target.value } : p);
                                    setPillarsState(updated);
                                  }}
                                  className="px-2 py-1.5 border rounded-lg outline-none resize-none text-xs"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  dbInstance.updatePillar(pillar);
                                  alert(`स्तंभ ${pillar.number} की सेटिंग्स सफलतापूर्वक अपडेट की गईं!`);
                                  setEditingPillarId(null);
                                  loadAllData();
                                }}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-[#efe7d6] text-xs font-bold font-hindi cursor-pointer rounded-lg flex items-center justify-center gap-1 shadow"
                              >
                                💾 सहेजें (Update Pillar)
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab 4: PRESIDENT MESSAGE CONFIG */}
                {cmsSubTab === "president" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      dbInstance.saveSiteContent(siteContentState);
                      alert("अध्यक्ष संदेश सेटिंग्स सहेज दी गईं!");
                      loadAllData();
                    }}
                    className="space-y-4 text-xs sm:text-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">संदेश खंड मुख्य शीर्षक</label>
                        <input
                          type="text"
                          value={siteContentState.presMessageTitle}
                          onChange={(e) => handleCmsFieldChange("presMessageTitle", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">अध्यक्ष का नाम *</label>
                        <input
                          type="text"
                          value={siteContentState.presMessageName}
                          onChange={(e) => handleCmsFieldChange("presMessageName", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-hindi text-stone-700 font-extrabold mb-1">अध्यक्षीय पदनाम designation (Hindi)</label>
                      <input
                        type="text"
                        value={siteContentState.presMessageRole}
                        onChange={(e) => handleCmsFieldChange("presMessageRole", e.target.value)}
                        className="px-3 py-2 border rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">अध्यक्षीय संदेश पैराग्राफ १ (Greeting)*</label>
                        <textarea
                          rows={2}
                          value={siteContentState.presMessageText1}
                          onChange={(e) => handleCmsFieldChange("presMessageText1", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">अध्यक्षीय संदेश पैराग्राफ २ (Strong Slogan/Plea)*</label>
                        <textarea
                          rows={2}
                          value={siteContentState.presMessageText2}
                          onChange={(e) => handleCmsFieldChange("presMessageText2", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">अध्यक्षीय संदेश पैराग्राफ ३ (Main Message Text)*</label>
                        <textarea
                          rows={3}
                          value={siteContentState.presMessageText3}
                          onChange={(e) => handleCmsFieldChange("presMessageText3", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-hindi text-stone-700 font-extrabold mb-1 block">अध्यक्षीय संदेश पैराग्राफ ४ (Concluding Plea)*</label>
                        <textarea
                          rows={3}
                          value={siteContentState.presMessageText4}
                          onChange={(e) => handleCmsFieldChange("presMessageText4", e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <ImageUploader
                        label="अध्यक्ष मुख्य चित्र (President Main Portrait)"
                        value={siteContentState.presMessageImg}
                        onChange={(base64) => handleCmsFieldChange("presMessageImg", base64)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0f4d24] text-[#efe7d6] rounded-xl font-hindi font-bold hover:bg-ngo-forest transition-colors flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      अध्यक्ष संदेश सेटिंग्स सहेजें (Save Message Settings)
                    </button>
                  </form>
                )}

                {/* Sub-tab 5: SITE IDENTITY SETTINGS */}
                {cmsSubTab === "website" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      dbInstance.saveSiteContent(siteContentState);
                      alert("वेबसाइट पहचान व लोगो सेटिंग्स सहेज दी गईं!");
                      loadAllData();
                    }}
                    className="space-y-4 text-xs sm:text-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">वेबसाइट का शीर्षक (Browser HTML Title) *</label>
                        <input
                          type="text"
                          required
                          value={siteContentState.siteTitle}
                          onChange={(e) => handleCmsFieldChange("siteTitle", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">संगठन लोगो नाम (Logo Brand Text) *</label>
                        <input
                          type="text"
                          required
                          value={siteContentState.siteLogoText}
                          onChange={(e) => handleCmsFieldChange("siteLogoText", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">लोगो का प्रतीक इमोजी (Logo Brand Emoji) *</label>
                        <input
                          type="text"
                          required
                          value={siteContentState.siteLogoEmoji}
                          onChange={(e) => handleCmsFieldChange("siteLogoEmoji", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">Favicon लिंक या पाथ (Favicon Link URL) *</label>
                        <input
                          type="text"
                          required
                          value={siteContentState.siteFavicon}
                          onChange={(e) => handleCmsFieldChange("siteFavicon", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none gap-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-hindi text-stone-700 font-extrabold mb-1">पाद लेख विवरण (Footer Summary Text) *</label>
                      <textarea
                        rows={3}
                        required
                        value={siteContentState.siteFooterText}
                        onChange={(e) => handleCmsFieldChange("siteFooterText", e.target.value)}
                        className="px-3 py-2 border rounded-xl outline-none resize-none col-span-2 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0f4d24] text-[#efe7d6] rounded-xl font-hindi font-bold hover:bg-ngo-forest transition-colors flex items-center gap-1 shadow cursor-pointer md:w-max"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      वेबसाइट पहचान सहेजें (Save Identity Settings)
                    </button>
                  </form>
                )}

                {/* Sub-tab 6: CONTACTS & SOCIAL LINKS */}
                {cmsSubTab === "links" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      dbInstance.saveSiteContent(siteContentState);
                      alert("संपर्क नंबर, सोशल मीडिया व गूगल मैप्स सेटिंग्स सहेज दी गईं!");
                      loadAllData();
                    }}
                    className="space-y-4 text-xs sm:text-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">आधिकारिक फोन नंबर (Phone Call) *</label>
                        <input
                          type="text"
                          required
                          value={siteContentState.contactPhone}
                          onChange={(e) => handleCmsFieldChange("contactPhone", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-hindi text-stone-700 font-extrabold mb-1">आधिकारिक ईमेल (Email Address) *</label>
                        <input
                          type="email"
                          required
                          value={siteContentState.contactEmail}
                          onChange={(e) => handleCmsFieldChange("contactEmail", e.target.value)}
                          className="px-3 py-2 border rounded-xl outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-hindi text-stone-700 font-extrabold mb-1">परिषद् मुख्यालय पता विवरण (Head Office Address) *</label>
                      <textarea
                        rows={2}
                        required
                        value={siteContentState.contactAddress}
                        onChange={(e) => handleCmsFieldChange("contactAddress", e.target.value)}
                        className="px-3 py-2 border rounded-xl outline-none resize-none text-xs"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-hindi text-stone-700 font-extrabold mb-1">
                        गूगल मैप्स एम्बेड लिंक (Google Maps Embed iframe src URL) *
                      </label>
                      <input
                        type="text"
                        required
                        value={siteContentState.contactMapUrl}
                        onChange={(e) => handleCmsFieldChange("contactMapUrl", e.target.value)}
                        className="px-3 py-2 border rounded-xl outline-none text-xs font-mono"
                      />
                    </div>

                    <div className="bg-stone-100 p-4 rounded-2xl border space-y-4">
                      <h4 className="font-bold text-[#0f4d24] border-b pb-2 mb-2 font-hindi text-xs sm:text-sm uppercase">
                        सोशल मीडिया संपर्क कड़ियां (Social Connection Links)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                        <div className="flex flex-col">
                          <label className="font-bold text-stone-700 mb-1">Facebook Page/Link</label>
                          <input
                            type="text"
                            value={siteContentState.socialFacebook}
                            onChange={(e) => handleCmsFieldChange("socialFacebook", e.target.value)}
                            className="px-3 py-2 bg-white border rounded-lg outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="font-bold text-stone-700 mb-1">Twitter (X) Link</label>
                          <input
                            type="text"
                            value={siteContentState.socialTwitter}
                            onChange={(e) => handleCmsFieldChange("socialTwitter", e.target.value)}
                            className="px-3 py-2 bg-white border rounded-lg outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="font-bold text-stone-700 mb-1">Instagram Link</label>
                          <input
                            type="text"
                            value={siteContentState.socialInstagram}
                            onChange={(e) => handleCmsFieldChange("socialInstagram", e.target.value)}
                            className="px-3 py-2 bg-white border rounded-lg outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="font-bold text-stone-700 mb-1">LinkedIn Page</label>
                          <input
                            type="text"
                            value={siteContentState.socialLinkedin}
                            onChange={(e) => handleCmsFieldChange("socialLinkedin", e.target.value)}
                            className="px-3 py-2 bg-white border rounded-lg outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0f4d24] text-[#efe7d6] rounded-xl font-hindi font-bold hover:bg-ngo-forest transition-colors flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      संपर्क व कड़ियां सहेजें (Save Web Links)
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL WINDOW FOR DYNAMIC CONTENT INITIALIZATIONS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-[#f5f1e8] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-300 relative max-h-[85vh] overflow-y-auto shadow-2xl">
            
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
            >
              닫기
            </button>

            <h3 className="font-hindi text-xl font-black text-[#0f4d24] border-b pb-2 mb-6">
              {activeTab === "campaigns" && "नया अभियान जोड़ें (Add Campaign)"}
              {activeTab === "gallery" && "नया गैलरी चित्र जोड़ें (Add Photo)"}
              {activeTab === "news" && "नया प्रेस नोट जोड़ें (Add News)"}
              {activeTab === "team_members" && "नया कार्यकर्ता जोड़ें (Add Worker)"}
            </h3>

            <form onSubmit={handleAddNewItem} className="space-y-4 font-hindi">
              
              {/* CAMPAIGN FIELDS */}
              {activeTab === "campaigns" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">अभियान का शीर्षक (हिन्दी में) *</label>
                    <input type="text" required placeholder="जैसे: कौरवी बोली बचाओ मुहीम" value={campTitleHi} onChange={e=>setCampTitleHi(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">अभियान का शीर्षक (English Title) *</label>
                    <input type="text" required placeholder=" जैसे: Save Kaurvi Language" value={campTitleEn} onChange={e=>setCampTitleEn(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">उप-शीर्षक (हिन्दी में)</label>
                    <input type="text" placeholder="जैसे: हमारी संस्कृति, हमारी धरोहर" value={campSubHi} onChange={e=>setCampSubHi(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">उप-शीर्षक (English Subtitle)</label>
                    <input type="text" placeholder="যেমন: Protect Our Roots" value={campSubEn} onChange={e=>setCampSubEn(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">विस्तृत विवरण (Description) *</label>
                    <textarea rows={3} required placeholder="इस अभियान के उद्देश्यों व गतिविधियों का विवरण..." value={campDesc} onChange={e=>setCampDesc(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none resize-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">चित्र पाथ (Image Source: /src/assets/images/...)</label>
                    <input type="text" placeholder="अथवा खाली छोड़ें" value={campImg} onChange={e=>setCampImg(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                </>
              )}

              {/* GALLERY FIELDS */}
              {activeTab === "gallery" && (
                <>
                  {/* Image Upload Zone */}
                  <div className="flex flex-col gap-1.5 font-hindi text-stone-900">
                    <label className="text-xs font-bold text-stone-700">गैलरी चित्र अपलोड करें (Upload Gallery Image) *</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-250 cursor-pointer text-center min-h-[140px]
                        ${
                          dragActive
                            ? "border-emerald-600 bg-emerald-500/5 scale-[1.01]"
                            : galPreview
                            ? "border-emerald-300/40 bg-stone-50"
                            : "border-stone-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/10"
                        }
                      `}
                    >
                      <input
                        id="gallery-file-upload"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                      />

                      {!galPreview ? (
                        <label
                          htmlFor="gallery-file-upload"
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4"
                        >
                          <Upload className="w-8 h-8 text-stone-400 mb-2 animate-bounce" />
                          <span className="text-xs font-bold text-stone-700 leading-tight">
                            यहाँ अपनी इमेज खींचे व छोड़े या क्लिक करें (Drag & Drop or Tap to Upload)
                          </span>
                          <span className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider font-sans">
                            JPG, PNG OR WEBP SUPPORTED
                          </span>
                        </label>
                      ) : (
                        <div className="relative w-full flex flex-col items-center py-2">
                          {/* Thumbnail preview */}
                          <div className="relative group/thumb rounded-xl overflow-hidden border border-stone-200 shadow-md aspect-video w-full max-w-[200px] mb-3">
                            <img
                              src={galPreview}
                              alt="Upload preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                              <label
                                htmlFor="gallery-file-upload"
                                className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-900 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow"
                              >
                                चित्र बदलें (Change)
                              </label>
                            </div>
                          </div>

                          {/* Path status feedback */}
                          <div className="text-center px-2">
                            <div className="text-[11px] text-emerald-700 font-extrabold flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 inline" />
                              छवि लोड हुई (Processed & Compressed)
                            </div>
                            <div className="text-[9px] font-mono select-all bg-stone-200/50 text-stone-600 rounded px-2 py-0.5 mt-1 break-all border border-stone-300/40">
                              <span className="font-sans font-bold text-stone-400 select-none mr-1">Path:</span>
                              {galGeneratedPath}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1 col-stone-700">चित्र का शीर्षक (Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="जैसे: प्रथम जल संसद बागपत"
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1 text-stone-700">चित्र श्रेणी (Category) *</label>
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value)}
                      className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-600 text-stone-800"
                    >
                      <option value="Hindon Bachao Movement">Hindon Bachao Movement</option>
                      <option value="Environmental Campaigns">Environmental Campaigns</option>
                      <option value="Jal Panchayat">Jal Panchayat</option>
                      <option value="Public Meetings">Public Meetings</option>
                      <option value="Ground Activities">Ground Activities</option>
                    </select>
                  </div>
                </>
              )}

              {/* NEWS FIELDS */}
              {activeTab === "news" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">प्रेस समाचार का शीर्षक *</label>
                    <input type="text" required placeholder="शीर्षक दर्ज करें" value={newsTitle} onChange={e=>setNewsTitle(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">समाचार श्रेणी *</label>
                    <select value={newsCategory} onChange={e=>setNewsCategory(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none">
                      <option value="जल अभियान">जल अभियान</option>
                      <option value="प्राकृतिक खेती">प्राकृतिक खेती</option>
                      <option value="सांस्कृतिक विधा">सांस्कृतिक विधा</option>
                      <option value="सैनिक संकल्प">सैनिक संकल्प</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">संक्षिप्त सारांश *</label>
                    <input type="text" required placeholder="संक्षिप्त विवरण डालें" value={newsSummary} onChange={e=>setNewsSummary(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">विस्तृत समाचार सामग्री (Full Content) *</label>
                    <textarea rows={4} required placeholder="समाचार की पूर्ण रिपोर्ट..." value={newsContent} onChange={e=>setNewsContent(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none resize-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">चित्र पाथ / स्रोत URL</label>
                    <input type="text" placeholder="/src/assets/images/yatra_crowd_night.png" value={newsImg} onChange={e=>setNewsImg(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                </>
              )}

              {/* TEAM FIELDS */}
              {activeTab === "team_members" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">कार्यकर्ता का नाम (हिन्दी में) *</label>
                    <input type="text" required placeholder="जैसे: नितिन स्वामी" value={teamNameHi} onChange={e=>setTeamNameHi(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">कार्यकर्ता का नाम (English Name) *</label>
                    <input type="text" required placeholder="जैसे: Nitin Swami" value={teamName} onChange={e=>setTeamName(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">पद / दायित्व (हिन्दी में) *</label>
                    <input type="text" required placeholder="जैसे: अध्यक्ष" value={teamRoleHi} onChange={e=>setTeamRoleHi(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">पद / दायित्व (English Role) *</label>
                    <input type="text" required placeholder="जैसे: President" value={teamRole} onChange={e=>setTeamRole(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">संक्षिप्त बायो रिपोर्ट</label>
                    <textarea rows={2} placeholder="कार्यकर्ता के इतिहास व क्षेत्र के बारे में..." value={teamBio} onChange={e=>setTeamBio(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none resize-none" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">चित्र पाथ / स्रोत URL</label>
                    <input type="text" placeholder="/src/assets/images/nitin_swami_1780203516611.png" value={teamImg} onChange={e=>setTeamImg(e.target.value)} className="px-3 py-2 bg-white border rounded-xl text-xs outline-none" />
                  </div>
                </>
              )}

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-stone-300 rounded-xl text-xs font-bold hover:bg-stone-105 cursor-pointer text-stone-600"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 bg-[#0f4d24] text-[#efe7d6] rounded-xl text-xs font-bold hover:bg-ngo-forest cursor-pointer"
                >
                  सहेजें एवं जोड़ें (Save Item)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL WINDOW FOR DYNAMIC ELEMENTS */}
      {editingItem && editingItemInput && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4" id="visual-edit-modal">
          <div className="bg-[#f5f1e8] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-300 relative max-h-[85vh] overflow-y-auto shadow-2xl">
            
            <button 
              type="button"
              onClick={() => {
                setEditingItem(null);
                setEditingItemInput(null);
              }}
              className="absolute top-4 right-4 text-stone-600 hover:text-stone-900 bg-stone-200/50 hover:bg-stone-200 p-2 rounded-full cursor-pointer transition-colors"
              title="बंद करें"
            >
              ✕
            </button>

            <h3 className="font-hindi text-lg font-black text-[#0f4d24] border-b pb-2 mb-6 uppercase">
              संशोधित करें (Edit {editingItem.type.replace("_", " ")})
            </h3>

            <form onSubmit={handleSaveEditedItem} className="space-y-4 font-hindi text-xs sm:text-sm">
              
              {/* CAMPAIGN FIELDS EDIT */}
              {editingItem.type === "campaign" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">अभियान शीर्षक (हिन्दी) *</label>
                    <input
                      type="text"
                      required
                      value={editingItemInput.titleHindi || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, titleHindi: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">Campaign Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={editingItemInput.titleEnglish || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, titleEnglish: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">विस्तृत विवरण (Description) *</label>
                    <textarea
                      rows={4}
                      required
                      value={editingItemInput.description || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, description: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none resize-none"
                    />
                  </div>

                  <ImageUploader
                    label="अभियान आवरण चित्र (Campaign Banner Image)"
                    value={editingItemInput.imageUrl || ""}
                    onChange={(base64) => setEditingItemInput({ ...editingItemInput, imageUrl: base64 })}
                  />
                </>
              )}

              {/* NEWS FIELDS EDIT */}
              {editingItem.type === "news" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">समाचार का शीर्षक *</label>
                    <input
                      type="text"
                      required
                      value={editingItemInput.title || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, title: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">समाचार श्रेणी *</label>
                    <select
                      value={editingItemInput.category || "जल अभियान"}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, category: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none"
                    >
                      <option value="जल अभियान">जल अभियान</option>
                      <option value="प्राकृतिक खेती">प्राकृतिक खेती</option>
                      <option value="सांस्कृतिक विधा">सांस्कृतिक विधा</option>
                      <option value="सैनिक संकल्प">सैनिक संकल्प</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">संक्षिप्त सारांश *</label>
                    <input
                      type="text"
                      required
                      value={editingItemInput.summary || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, summary: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1">विस्तृत समाचार सामग्री (Full Content) *</label>
                    <textarea
                      rows={5}
                      required
                      value={editingItemInput.content || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, content: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none resize-none"
                    />
                  </div>

                  <ImageUploader
                    label="समाचार चित्र/पेपर कटिंग (News Image clipping)"
                    value={editingItemInput.imageUrl || ""}
                    onChange={(base64) => setEditingItemInput({ ...editingItemInput, imageUrl: base64 })}
                  />
                </>
              )}

              {/* GALLERY FIELDS EDIT */}
              {editingItem.type === "gallery" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1 col-stone-700">गैलरी चित्र शीर्षक (Title) *</label>
                    <input
                      type="text"
                      required
                      value={editingItemInput.title || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, title: e.target.value })}
                      className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1 text-stone-700">गैलरी चित्र श्रेणी (Category) *</label>
                    <select
                      value={editingItemInput.category || "Jal Panchayat"}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, category: e.target.value })}
                      className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs outline-none text-stone-800"
                    >
                      <option value="Hindon Bachao Movement">Hindon Bachao Movement</option>
                      <option value="Environmental Campaigns">Environmental Campaigns</option>
                      <option value="Jal Panchayat">Jal Panchayat</option>
                      <option value="Public Meetings">Public Meetings</option>
                      <option value="Ground Activities">Ground Activities</option>
                    </select>
                  </div>

                  <ImageUploader
                    label="गैलरी चित्र (Gallery Photo)"
                    value={editingItemInput.url || ""}
                    onChange={(base64) => setEditingItemInput({ ...editingItemInput, url: base64 })}
                  />
                </>
              )}

              {/* TEAM MEMBERS FIELDS EDIT */}
              {editingItem.type === "team_members" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold mb-1">नाम (हिन्दी में) *</label>
                      <input
                        type="text"
                        required
                        value={editingItemInput.nameHindi || ""}
                        onChange={(e) => setEditingItemInput({ ...editingItemInput, nameHindi: e.target.value })}
                        className="px-2 py-1.5 bg-white border rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold mb-1">Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={editingItemInput.name || ""}
                        onChange={(e) => setEditingItemInput({ ...editingItemInput, name: e.target.value })}
                        className="px-2 py-1.5 bg-white border rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold mb-1">दायित्व/पद (हिन्दी) *</label>
                      <input
                        type="text"
                        required
                        value={editingItemInput.roleHindi || ""}
                        onChange={(e) => setEditingItemInput({ ...editingItemInput, roleHindi: e.target.value })}
                        className="px-2 py-1.5 bg-white border rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold mb-1">Role (English) *</label>
                      <input
                        type="text"
                        required
                        value={editingItemInput.role || ""}
                        onChange={(e) => setEditingItemInput({ ...editingItemInput, role: e.target.value })}
                        className="px-2 py-1.5 bg-white border rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-bold mb-1 col-stone-700">संक्षिप्त बायो रिपोर्ट</label>
                    <textarea
                      rows={2}
                      value={editingItemInput.bio || ""}
                      onChange={(e) => setEditingItemInput({ ...editingItemInput, bio: e.target.value })}
                      className="px-3 py-2 bg-white border rounded-xl outline-none resize-none"
                    />
                  </div>

                  <ImageUploader
                    label="कार्यकर्ता चित्र (Worker Photo)"
                    value={editingItemInput.imageUrl || ""}
                    onChange={(base64) => setEditingItemInput({ ...editingItemInput, imageUrl: base64 })}
                  />
                </>
              )}

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setEditingItemInput(null);
                  }}
                  className="flex-1 py-2.5 border border-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer text-stone-600"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 bg-[#0f4d24] text-[#efe7d6] rounded-xl text-xs font-bold hover:bg-[#155e2d] cursor-pointer"
                >
                  संशोधन सहेजें (Save Changes)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
