import React, { useState, useEffect } from "react";
import { User, Phone, Mail, FileText, CheckCircle, ShieldCheck, Download, Award, Share2 } from "lucide-react";
import { PILLARS_DATA } from "../data";
import { dbInstance, UserProfile } from "../lib/db";

export default function JoinForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    branch: PILLARS_DATA[0].title,
    city: "",
    pledgedToPurity: false,
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [memberId, setMemberId] = useState("");

  // Check login state to pre-fill info
  useEffect(() => {
    const stored = localStorage.getItem("pvp_current_user");
    if (stored) {
      try {
        const user: UserProfile = JSON.parse(stored);
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          phone: user.phone || "",
          email: user.email || ""
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to DB
    const newVol = dbInstance.addVolunteer({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      branch: formData.branch,
      city: formData.city,
      message: formData.message
    });

    // If logged in, mirror chosen pillar to user profile
    const stored = localStorage.getItem("pvp_current_user");
    if (stored) {
      try {
        const user: UserProfile = JSON.parse(stored);
        dbInstance.userVolunteerPillar(user.uid, formData.branch);

        // Update active profile in memory
        const users = dbInstance.getUsers();
        const updatedUser = users.find(u => u.uid === user.uid);
        if (updatedUser) {
          localStorage.setItem("pvp_current_user", JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error(err);
      }
    }

    setMemberId(newVol.id);
    setIsSubmitted(true);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <section
      id="join"
      className="py-16 sm:py-24 bg-[#efe7d6]/30 relative scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="leaf-divider font-hindi text-ngo-forest font-bold text-lg select-none">
            🚩 आंदोलन से जुड़ें 🚩
          </div>
          <h2 className="font-hindi text-3xl sm:text-4xl font-black text-stone-900 mt-2.5">
            पर्यावरण सेना के सैनिक बनें
          </h2>
          <p className="text-stone-600 mt-4 text-sm sm:text-base font-medium">
            एक जिम्मेदार नागरिक के नाते पश्चिमांचल के पुनरुत्थान में अपनी सहभागिता दर्ज करें। अपना नाम पंजीकृत कर तुरंत 'स्वयंसेवक प्रमाण-पत्र' प्राप्त करें।
          </p>
        </div>

        {/* Form and info split content state depending on submission */}
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start" id="membership-form-grid">
            
            {/* Left side text CTA guidelines block */}
            <div className="lg:col-span- così lg:col-span-5 space-y-6 sm:space-y-8">
              
              <div className="bg-[#f5f1e8] p-6 rounded-2xl border border-stone-200 shadow-md">
                <h3 className="font-hindi text-xl font-bold text-[#0f4d24] flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  सैनिक बनने के कर्तव्य व प्रतिज्ञा
                </h3>
                <ul className="font-hindi text-stone-700 text-sm sm:text-base space-y-3.5 leading-relaxed font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-ngo-forest mt-1 flex-shrink-0">✓</span>
                    <span>प्रत्येक सैनिक प्रतिवर्ष कम से कम 5 महत्वपूर्ण फलदार या औषधीय पौधे लगाएगा और उनके बड़े होने तक रक्षा करेगा।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ngo-forest mt-1 flex-shrink-0">✓</span>
                    <span>अपने परिवार व आस-पास के जलस्रोतों (कुओं, तालाबों) को प्रदूषित होने से रोकेगा तथा वर्षा जल संचयन करेगा।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ngo-forest mt-1 flex-shrink-0">✓</span>
                    <span>स्थानीय बोली कौरवी और कला विधाओं को बढ़ावा देगा तथा समाज को नशा मुक्त करने में भागीदार बनेगा।</span>
                  </li>
                </ul>
              </div>

              {/* Stat Card visual helper */}
              <div className="bg-[#0f4d24] text-[#efe7d6] p-6 rounded-2xl border border-ngo-forest/35 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur" />
                <h4 className="font-hindi text-lg font-bold">10K से अधिक नागरिक जुड़े हैं</h4>
                <p className="font-hindi text-xs sm:text-sm text-stone-200 mt-2">
                  मेरठ, बागपत, शामली, सहारनपुर और मुजफ्फरनगर क्षेत्र के लगभग हर ब्लॉक से युवा पर्यावरण प्रहरी बनकर सेवा कर रहे हैं।
                </p>
              </div>

            </div>

            {/* Right side form block */}
            <div className="lg:col-span-7 bg-[#f5f1e8] p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-200 relative">
              <div className="absolute inset-2 border border-dashed border-ngo-forest/15 rounded-2xl pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="relative space-y-6 z-10" aria-label="Volunteer Registration">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label htmlFor="fullName" className="font-hindi text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                      पूरा नाम (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        required
                        placeholder="जैसे: राहुल शर्मा"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-[#efe7d6]/60 border border-stone-350 focus:border-ngo-forest rounded-xl font-hindi text-stone-900 focus:outline-none focus:ring-1 focus:ring-ngo-forest"
                      />
                    </div>
                  </div>

                  {/* Phone number */}
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="font-hindi text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                      मोबाइल नंबर (Mobile) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        pattern="[0-9]{10}"
                        placeholder="10 अंकों का संख्या"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-[#efe7d6]/60 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-[#1a2d1d] focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Email address */}
                  <div className="flex flex-col">
                    <label htmlFor="email" className="font-hindi text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                      ईमेल एड्रेस (Email)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="sample@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-[#efe7d6]/60 border border-stone-350 focus:border-ngo-forest rounded-xl font-sans text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* City/Resident Block */}
                  <div className="flex flex-col">
                    <label htmlFor="city" className="font-hindi text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                      गाँव / शहर / जिला (City/Village) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="city"
                        id="city"
                        required
                        placeholder="जैसे: बागपत"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-[#efe7d6]/60 border border-stone-350 focus:border-ngo-forest rounded-xl font-hindi text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Preferred Pillar dropdown */}
                <div className="flex flex-col">
                  <label htmlFor="branch" className="font-hindi text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                    कार्य का पसंदीदा क्षेत्र (Preferred Pillar)
                  </label>
                  <select
                    name="branch"
                    id="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#efe7d6]/60 border border-stone-350 focus:border-ngo-forest rounded-xl font-hindi text-stone-900 focus:outline-none focus:ring-1 focus:ring-ngo-forest"
                  >
                    {PILLARS_DATA.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.number}. {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brief Message text area */}
                <div className="flex flex-col">
                  <label htmlFor="message" className="font-hindi text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                    आप परिषद से क्यों जुड़ना चाहते हैं? (Message)
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={3}
                    placeholder="आपके विचार या सेवा इच्छा..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#efe7d6]/60 border border-stone-350 focus:border-ngo-forest rounded-xl font-hindi text-stone-900 focus:outline-none focus:ring-1 focus:ring-ngo-forest resize-none"
                  />
                </div>

                {/* Pledge Checkbox */}
                <div className="flex items-start gap-3 bg-[#efe7d6]/40 p-4 rounded-xl border border-stone-300">
                  <input
                    type="checkbox"
                    name="pledgedToPurity"
                    id="pledgedToPurity"
                    required
                    checked={formData.pledgedToPurity}
                    onChange={handleChange}
                    className="mt-1 w-4.5 h-4.5 rounded text-ngo-forest focus:ring-ngo-forest bg-stone-100 border-[#efe7d6]/80"
                  />
                  <label htmlFor="pledgedToPurity" className="font-hindi text-xs sm:text-sm text-stone-700 leading-normal select-none">
                     मैं प्रतिज्ञा करता हूँ कि पश्चिमांचल की नदियों व पर्यावरण के प्रति सदैव सजग रहूँगा, नशामुक्त तथा संस्कारयुक्त जीवन यापन का यथासंभव प्रयास करूँगा। <span className="text-red-500">*</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#1b5025] hover:bg-[#113a19] text-[#efe7d6] py-4 rounded-xl font-hindi text-lg font-bold shadow-md hover:shadow-xl transition-all duration-305 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  प्रतिज्ञा लें एवं सैनिक प्रमाण-पत्र प्राप्त करें
                </button>

              </form>
            </div>

          </div>
        ) : (
          /* Submission success block showing Honor Certificate */
          <div className="max-w-3xl mx-auto flex flex-col items-center" id="membership-certificate-block">
            
            {/* Celebration title info */}
            <div className="text-center mb-8 bg-emerald-600/10 border border-emerald-200 rounded-2xl py-4 px-6 max-w-xl">
              <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto animate-bounce mb-2" />
              <h3 className="font-hindi text-xl sm:text-2xl font-black text-emerald-800">
                बधाई हो! आप 'पर्यावरण सैनिक' बन चुके हैं।
              </h3>
              <p className="font-hindi text-xs sm:text-sm text-stone-600 mt-1">
                आपका ऑनलाइन पर्यावरण सैनिक सम्मान-पत्र सफलतापूर्वक तैयार कर दिया गया है।
              </p>
            </div>

            {/* Printable Certificate Frame */}
            <div
              className="bg-[#faf7f0] rounded-3xl p-6 sm:p-10 border-[12px] border-ngo-dark shadow-2xl relative overflow-hidden w-full max-w-2xl select-none text-stone-900 border-double"
              id="printable-certificate-honor"
            >
              
              {/* Outer watermark circular lines */}
              <div className="absolute inset-2 border-2 border-amber-900/15 rounded-2xl pointer-events-none" />
              <div className="absolute inset-4 border border-ngo-forest/20 rounded-xl pointer-events-none" />
              
              {/* Watermarked giant logo inside certificate background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] -z-10 bg-no-repeat pointer-events-none scale-150">
                🌱
              </div>

              {/* Certificate content inside */}
              <div className="flex flex-col items-center text-center">
                
                {/* Traditional Sanskrit Headings */}
                <span className="text-[10px] font-sans text-stone-500 tracking-widest font-bold uppercase leading-none mb-1">
                  OFFICIAL INDUCTION CERTIFICATE
                </span>
                
                <h4 className="font-hindi text-2xl sm:text-3.5xl font-black text-[#0f4d24] mt-1 tracking-wide leading-none">
                  पश्चिमांचल विकास परिषद (भारत)
                </h4>
                <span className="font-hindi text-xs text-amber-800 font-bold bg-[#efe7d6] py-1 px-3 rounded-full border border-stone-300 mt-2">
                  "वसुधैव कुटुम्बकम् • प्रकृतिः रक्षति रक्षिता"
                </span>

                <div className="w-16 h-1 w-stone-300 my-5" />

                {/* Honor Title */}
                <h5 className="font-hindi text-2.5xl sm:text-4.5xl text-amber-900 font-black tracking-wider leading-none">
                  🌻 पर्यावरण सैनिक सम्मान पत्र 🌻
                </h5>

                {/* Declaration letter detail */}
                <p className="font-hindi text-stone-700 text-sm mt-6 leading-relaxed max-w-md font-medium">
                  ससम्मान प्रमाणित किया जाता है कि श्री/श्रीमती 
                </p>

                {/* Recipient custom Name */}
                <span className="font-hindi text-2xl sm:text-3xl font-black text-stone-900 border-b-2 border-dashed border-stone-800/60 pb-1.5 px-6 my-3 leading-none tracking-wide text-center">
                  {formData.fullName}
                </span>

                {/* Residence location */}
                <span className="font-hindi text-xs sm:text-sm text-stone-550 italic">
                  निवासी: <strong className="text-stone-800 font-bold font-hindi">{formData.city}</strong>
                </span>

                {/* Statement of volunteer service induction */}
                <div className="font-hindi text-stone-800 text-xs sm:text-sm leading-relaxed max-w-lg mt-5 font-semibold space-y-1">
                  <p>
                    ने स्वेच्छा से परिषद के संवर्धन प्रभाग के रूप में
                  </p>
                  <p className="font-hindi text-ngo-forest text-sm sm:text-base font-black italic bg-ngo-forest/10 py-1.5 px-4 rounded-xl border border-stone-300 w-max mx-auto my-2.5">
                    "{formData.branch}"
                  </p>
                  <p>
                    में योगदान देने तथा पर्यावरण राष्ट्रहित की रक्षा हेतु संकल्प लिया है। परिषद आपके उज्ज्वल व प्राकृतिक भविष्य की मंगल कामना करती है।
                  </p>
                </div>

                {/* Meta details footer: ID, Sign, Seal */}
                <div className="grid grid-cols-3 gap-4 w-full mt-10 pt-6 border-t border-stone-300/60 items-end">
                  
                  {/* Left Column: ID & Date */}
                  <div className="flex flex-col items-start font-hindi text-[10px] sm:text-xs text-left">
                    <span className="text-[#1f6b35] font-extrabold font-sans">ID: {memberId}</span>
                    <span className="text-stone-500 font-normal">दिनांक: {new Date().toLocaleDateString("hi-IN")}</span>
                    <span className="text-[10px] font-sans text-stone-400">PVP Core Cell</span>
                  </div>

                  {/* Middle Column: Seal Stamp */}
                  <div className="flex flex-col items-center">
                    {/* Retro seal circular design */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-amber-800/30 flex items-center justify-center bg-amber-800/10 text-amber-800 rotate-12 relative animate-pulse shadow-inner select-none">
                      <div className="text-[8px] font-sans font-black flex flex-col items-center leading-none text-center">
                        <span>PVP SEAL</span>
                        <span className="text-[11px] mt-1">🌱</span>
                        <span>OFFICIAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: President Sign */}
                  <div className="flex flex-col items-end text-right font-hindi text-[10px]">
                    {/* SVG mini handwriting trace for official look */}
                    <svg width="80" height="25" viewBox="0 0 100 30" className="opacity-80">
                      <path d="M 5 20 C 20 10, 30 5, 50 15 C 70 25, 80 5, 95 10" fill="none" stroke="#1c3e1c" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="font-hindi font-bold text-stone-800 mt-1">(नितिन स्वामी)</span>
                    <span className="text-[9px] font-sans text-stone-400">President, PVP</span>
                  </div>

                </div>

              </div>

            </div>

            {/* Action buttons after submission */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 w-full">
              
              <button
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-2 bg-[#0f4d24] hover:bg-ngo-forest text-[#efe7d6] py-3 px-6 rounded-xl font-hindi text-base font-bold shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                प्रमाण-पत्र डाउनलोड / प्रिंट करें
              </button>

              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-750 py-3 px-6 rounded-xl font-hindi text-base font-bold shadow transition-colors cursor-pointer"
              >
                दूसरा नाम पंजीकृत करें
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
