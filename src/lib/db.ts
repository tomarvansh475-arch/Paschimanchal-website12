import { Pillar, Campaign, NewsItem, TeamMember, GalleryImage, DonationOption, SiteContent } from "../types";
import { 
  PILLARS_DATA, 
  CAMPAIGNS_DATA, 
  NEWS_DATA, 
  TEAM_DATA, 
  GALLERY_DATA, 
  DONATION_OPTIONS 
} from "../data";

const DEFAULT_SITE_CONTENT: SiteContent = {
  // Hero
  heroTitle: "पश्चिमांचल विकास परिषद",
  heroSubtitle: "🌿 प्रकृति से संस्कृति की ओर 🌿",
  heroPresidentImg: "/src/assets/images/nitin_swami_1780203516611.png",
  heroPresidentName: "नितिन स्वामी",
  heroPresidentSubtitle: "President, Paschimanchal Vikas Parishad (Bharat)",
  heroSlogan: "हम विकास के विरोध में नहीं हैं, विनाश के विरोध में खड़े हैं। आज पश्चिमांचल जल संकट और घातक बीमारियों की ओर बढ़ रहा है, जैसे कैंसर इत्यादि। हम अपने क्षेत्र को बर्बाद नहीं होने देंगे।",
  heroBtnText: "Join The Movement",
  heroVideoUrl: "",

  // About Us
  aboutBadge: "🌱 युगानुकूल सामाजिक संकल्प 🌱",
  aboutTitle: "परिचय एवं वैचारिक आधारभूमि",
  aboutText1: "पश्चिमांचल विकास परिषद (भारत) की स्थापना 01 अक्टूबर 2026, बुधवार को पश्चिमी उत्तर प्रदेश के छोटे से कस्बे कांधला, जनपद शामली (उ०प्र०) में की गई।",
  aboutText2: "यह संगठन केवल विकास की बात नहीं करता, बल्कि उस विनाश को रोकने के लिए कार्यरत है जो आने वाले समय में पश्चिमांचल की प्रकृति, संस्कृति और समाज के लिए गंभीर संकट बन सकता है। हमारा पहला प्रयास पश्चिमांचल के समग्र विकास के साथ-साथ जल, जंगल, ज़मीन, और जीवों की रक्षा करना है।",
  aboutText3: "संगठन शिक्षा, स्वास्थ्य, न्याय, संस्कृति, रोजगार, पर्यावरण और खेल — इन सात प्रमुख स्तंभों पर कार्य करता है।",
  aboutWarningText: "⚠️ आज पश्चिमांचल अत्यंत गंभीर जल संकट की ओर बढ़ रहा है। नदियाँ प्रदूषित हो रही हैं, भूजल दूषित होता जा रहा है और कई क्षेत्र धीरे-धीरे गंभीर बीमारियों एवं कैंसर प्रभावित क्षेत्र बनने की आशंका की ओर बढ़ रहे हैं। हम मानते हैं कि यदि अभी समाज जागरूक नहीं हुआ तो आने वाली पीढ़ियों को इसका भारी मूल्य चुकाना पड़ेगा।",
  aboutText4: "इसी उद्देश्य से संगठन द्वारा “हिंडन बचाओ – पश्चिमांचल बचाओ”, जल पंचायत और “कौरवी बोली बचाओ” जैसे राष्ट्रव्यापी और क्षेत्रीय जनजागरूकता अभियानों का सफल संचालन किया जा रहा है।",
  aboutQuote: "“विकास हमारी पहली प्राथमिकता नहीं, बल्कि उस विनाश को रोकना हमारी प्राथमिकता है जो प्रकृति और समाज को समाप्त कर सकता है।”",
  aboutQuoteAuthor: "— अध्यक्षीय विचार धारा, पश्चिमांचल विकास परिषद",
  aboutFooterText: "पश्चिमांचल विकास परिषद प्रकृति से संस्कृति की ओर बढ़ने वाले संतुलित समाज की परिकल्पना में विश्वास रखता है, जहाँ पर्यावरण संरक्षण, क्षेत्रीय पहचान, लोकभाषा, ग्रामीण चेतना और युवा सहभागिता साथ-साथ आगे बढ़ें।",
  aboutImg1: "/src/assets/images/stage_banner_kandhla.png",
  aboutImg2: "/src/assets/images/river_march_stones.png",
  aboutImg3: "/src/assets/images/volunteers_salute.png",
  aboutDate: "01 अक्टूबर 2026",

  // President Message
  presMessageTitle: "अध्यक्ष जी का विचार प्रवाह",
  presMessageName: "नितिन स्वामी",
  presMessageRole: "अध्यक्ष, पश्चिमांचल विकास परिषद (भारत)",
  presMessageImg: "/src/assets/images/nitin_swami_1780203516611.png",
  presMessageText1: "प्रिय पश्चिमांचलवासियों, ऊर्जावान युवाओं और पर्यावरण सैनिकों,",
  presMessageText2: "“हम विकास के विरोध में नहीं हैं, विनाश के विरोध में खड़े हैं।” आज हमारा पश्चिमांचल अत्यंत गंभीर जल संकट और जानलेवा घातक बीमारियों (जैसे कैंसर इत्यादि) की ओर बढ़ रहा है। प्रदूषण और हमारी अकर्मण्यता के कारण हमारे पारंपरिक तालाब सूख रहे हैं, नदियाँ जैसे हिंडन विनाश के कगार पर हैं और भूजल जहरीला हो चुका है। हम मूकदर्शक बनकर अपने सुंदर क्षेत्र को बर्बाद नहीं होने देंगे!",
  presMessageText3: "पश्चिमांचल विकास परिषद (भारत) की आधारशिला केवल सामाजिक सुधार के लिए नहीं, बल्कि मिट्टी की रक्षा और अपनी पहचान को अक्षुण्ण बनाए रखने के व्यापक जनांदोलन के रूप में रखी गई है। हमारा ध्येय स्पष्ट है — शिक्षा को सुलभ बनाना, स्वास्थ्य के प्रति चेतना फैलाना, और पर्यावरण को फिर से प्राचीन गौरव प्रदान करना।",
  presMessageText4: "आप सब से मेरी विनम्र अपील है कि इस महायज्ञ में आहुति दें। आपके द्वारा लिया गया छोटा सा संकल्प — चाहे वह जल संवर्धन हो, वृक्षारोपण हो, या व्यसनमुक्त समाज का निर्माण — हमारी आने वाली पीढ़ियों के सुरक्षित कल का निर्माण करेगा। आइए, मिलकर आवाज उठाएं और अभियान से जुड़ें।",

  // Contact Info
  contactPhone: "+91 9720220072",
  contactEmail: "paschimanchalvikasparisad@gmail.com",
  contactAddress: "ग्राम इस्लामपुर घसौली, जिला शामली (पश्चिमी उत्तर प्रदेश), पिन - 247775",
  contactMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55355.61767171439!2d77.2755325!3d29.4475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c21be9ab5ff73%3A0xe5a3c00445d4c885!2sShamli%2C%20Uttar%20Pradesh%20247775!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",

  // Website Settings
  siteLogoText: "पश्चिमांचल विकास परिषद",
  siteLogoEmoji: "🌱",
  siteFavicon: "🌱",
  siteTitle: "पश्चिमांचल विकास परिषद (भारत)",
  siteFooterText: "हमारा संगठन गंगा-यमुना दोआब की जल संपदा, वन संरक्षण तथा कौरवी बोली की सांस्कृतिक पहचान को अक्षुण्ण रखने के लिए प्रतिबद्ध एक राष्ट्रवादी सामाजिक जनांदोलन है।",
  socialTwitter: "#",
  socialFacebook: "#",
  socialInstagram: "#",
  socialLinkedin: "#"
};

export interface Volunteer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  branch: string;
  city: string;
  message?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  role: "user" | "admin";
  joinedCampaignIds: string[];
  volunteeredPillars: string[];
  createdAt: string;
  password?: string;
}

export interface DonationRecord {
  receiptId: string;
  donorName: string;
  donorEmail: string;
  pan: string;
  amount: number;
  date: string;
  status: string;
  userId?: string; // linked if logged in
}

class PVPDatabase {
  constructor() {
    this.initializeDefaultData();
  }

  public initializeDefaultData(force: boolean = false) {
    if (force || !localStorage.getItem("pvp_db_initialized")) {
      localStorage.setItem("pvp_campaigns", JSON.stringify(CAMPAIGNS_DATA));
      localStorage.setItem("pvp_news", JSON.stringify(NEWS_DATA));
      localStorage.setItem("pvp_team", JSON.stringify(TEAM_DATA));
      localStorage.setItem("pvp_gallery", JSON.stringify(GALLERY_DATA));
      localStorage.setItem("pvp_donations", JSON.stringify([]));
      localStorage.setItem("pvp_volunteers", JSON.stringify([]));
      localStorage.setItem("pvp_pillars", JSON.stringify(PILLARS_DATA));
      localStorage.setItem("pvp_site_content", JSON.stringify(DEFAULT_SITE_CONTENT));
      
      // Default Admin User
      const adminUser: UserProfile = {
        uid: "admin-default",
        fullName: "Vansh Tomar (Administrator)",
        email: "tomarvansh475@gmail.com",
        phone: "9876543210",
        bio: "पश्चिमांचल विकास परिषद के राष्ट्रीय मुख्य प्रचालक व प्रशासक।",
        role: "admin",
        joinedCampaignIds: [],
        volunteeredPillars: [],
        createdAt: new Date().toISOString(),
        password: "admin" // Root admin standard fallback 
      };

      const users = [adminUser];
      localStorage.setItem("pvp_users", JSON.stringify(users));
      localStorage.setItem("pvp_db_initialized", "true");
    }
  }

  // --- SITE CONTENT ---
  getSiteContent(): SiteContent {
    const defaultData = localStorage.getItem("pvp_site_content");
    if (!defaultData) {
      return DEFAULT_SITE_CONTENT;
    }
    try {
      return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(defaultData) };
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  }

  saveSiteContent(content: SiteContent) {
    localStorage.setItem("pvp_site_content", JSON.stringify(content));
    
    // Dynamically update document head title and favicon
    document.title = content.siteTitle || "पश्चिमांचल विकास परिषद (भारत)";
    const faviconElement = document.getElementById("favicon") || document.querySelector("link[rel*='icon']");
    if (faviconElement) {
      faviconElement.setAttribute("href", `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${content.siteFavicon || "🌱"}</text></svg>`);
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.id = "favicon";
      link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${content.siteFavicon || "🌱"}</text></svg>`;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }

  // --- PILLARS ---
  getPillars(): Pillar[] {
    const pillars = localStorage.getItem("pvp_pillars");
    if (!pillars) {
      return PILLARS_DATA;
    }
    try {
      return JSON.parse(pillars);
    } catch {
      return PILLARS_DATA;
    }
  }

  savePillars(pillars: Pillar[]) {
    localStorage.setItem("pvp_pillars", JSON.stringify(pillars));
  }

  updatePillar(pillar: Pillar) {
    const pillars = this.getPillars();
    const index = pillars.findIndex(p => p.id === pillar.id);
    if (index !== -1) {
      pillars[index] = pillar;
      this.savePillars(pillars);
    }
  }

  // --- CAMPAIGNS ---
  getCampaigns(): Campaign[] {
    return JSON.parse(localStorage.getItem("pvp_campaigns") || "[]");
  }

  saveCampaigns(campaigns: Campaign[]) {
    localStorage.setItem("pvp_campaigns", JSON.stringify(campaigns));
  }

  addCampaign(campaign: Omit<Campaign, "id" | "pledgedCount">): Campaign {
    const campaigns = this.getCampaigns();
    const newCampaign: Campaign = {
      ...campaign,
      id: `c_${Date.now()}`,
      pledgedCount: 0
    };
    campaigns.push(newCampaign);
    this.saveCampaigns(campaigns);
    return newCampaign;
  }

  updateCampaign(campaign: Campaign) {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex(c => c.id === campaign.id);
    if (index !== -1) {
      campaigns[index] = campaign;
      this.saveCampaigns(campaigns);
    }
  }

  deleteCampaign(id: string) {
    const campaigns = this.getCampaigns();
    this.saveCampaigns(campaigns.filter(c => c.id !== id));
  }

  pledgeToCampaign(campaignId: string): number {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex(c => c.id === campaignId);
    if (index !== -1) {
      campaigns[index].pledgedCount += 1;
      this.saveCampaigns(campaigns);
      return campaigns[index].pledgedCount;
    }
    return 0;
  }

  // --- NEWS ---
  getNews(): NewsItem[] {
    return JSON.parse(localStorage.getItem("pvp_news") || "[]");
  }

  saveNews(news: NewsItem[]) {
    localStorage.setItem("pvp_news", JSON.stringify(news));
  }

  addNews(newsItem: Omit<NewsItem, "id" | "views">): NewsItem {
    const news = this.getNews();
    const newNewsItem: NewsItem = {
      ...newsItem,
      id: `n_${Date.now()}`,
      views: 0
    };
    news.push(newNewsItem);
    this.saveNews(news);
    return newNewsItem;
  }

  updateNews(newsItem: NewsItem) {
    const news = this.getNews();
    const index = news.findIndex(n => n.id === newsItem.id);
    if (index !== -1) {
      news[index] = newsItem;
      this.saveNews(news);
    }
  }

  deleteNews(id: string) {
    const news = this.getNews();
    this.saveNews(news.filter(n => n.id !== id));
  }

  incrementNewsViews(id: string) {
    const news = this.getNews();
    const index = news.findIndex(n => n.id === id);
    if (index !== -1) {
      news[index].views += 1;
      this.saveNews(news);
    }
  }

  // --- TEAM ---
  getTeam(): TeamMember[] {
    return JSON.parse(localStorage.getItem("pvp_team") || "[]");
  }

  saveTeam(team: TeamMember[]) {
    localStorage.setItem("pvp_team", JSON.stringify(team));
  }

  addTeamMember(member: Omit<TeamMember, "id">): TeamMember {
    const team = this.getTeam();
    const newMember: TeamMember = {
      ...member,
      id: `t_${Date.now()}`
    };
    team.push(newMember);
    this.saveTeam(team);
    return newMember;
  }

  updateTeamMember(member: TeamMember) {
    const team = this.getTeam();
    const index = team.findIndex(t => t.id === member.id);
    if (index !== -1) {
      team[index] = member;
      this.saveTeam(team);
    }
  }

  deleteTeamMember(id: string) {
    const team = this.getTeam();
    this.saveTeam(team.filter(t => t.id !== id));
  }

  // --- GALLERY ---
  getGallery(): GalleryImage[] {
    return JSON.parse(localStorage.getItem("pvp_gallery") || "[]");
  }

  saveGallery(gallery: GalleryImage[]) {
    localStorage.setItem("pvp_gallery", JSON.stringify(gallery));
  }

  addGalleryImage(image: Omit<GalleryImage, "id">): GalleryImage {
    const gallery = this.getGallery();
    const newImage: GalleryImage = {
      ...image,
      id: `g_${Date.now()}`
    };
    gallery.push(newImage);
    this.saveGallery(gallery);
    return newImage;
  }

  deleteGalleryImage(id: string) {
    const gallery = this.getGallery();
    this.saveGallery(gallery.filter(g => g.id !== id));
  }

  updateGalleryImage(image: GalleryImage) {
    const gallery = this.getGallery();
    const updated = gallery.map(g => g.id === image.id ? image : g);
    this.saveGallery(updated);
  }

  // --- VOLUNTEERS ---
  getVolunteers(): Volunteer[] {
    return JSON.parse(localStorage.getItem("pvp_volunteers") || "[]");
  }

  addVolunteer(volunteer: Omit<Volunteer, "id" | "createdAt">): Volunteer {
    const volunteers = this.getVolunteers();
    const newVolunteer: Volunteer = {
      ...volunteer,
      id: `PVP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    volunteers.push(newVolunteer);
    localStorage.setItem("pvp_volunteers", JSON.stringify(volunteers));
    return newVolunteer;
  }

  deleteVolunteer(id: string) {
    const volunteers = this.getVolunteers();
    localStorage.setItem("pvp_volunteers", JSON.stringify(volunteers.filter(v => v.id !== id)));
  }

  // --- DONATIONS ---
  getDonations(): DonationRecord[] {
    return JSON.parse(localStorage.getItem("pvp_donations") || "[]");
  }

  addDonation(donation: Omit<DonationRecord, "status">): DonationRecord {
    const donations = this.getDonations();
    const newDonation: DonationRecord = {
      ...donation,
      status: "सफल (Paid)"
    };
    donations.push(newDonation);
    localStorage.setItem("pvp_donations", JSON.stringify(donations));
    
    // Also mirror to old pvp_donations_history in localStorage to remain compatible
    localStorage.setItem("pvp_donations_history", JSON.stringify(donations));
    
    return newDonation;
  }

  deleteDonation(receiptId: string) {
    const donations = this.getDonations();
    const updated = donations.filter(d => d.receiptId !== receiptId);
    localStorage.setItem("pvp_donations", JSON.stringify(updated));
    localStorage.setItem("pvp_donations_history", JSON.stringify(updated));
  }

  // --- USERS ---
  getUsers(): UserProfile[] {
    return JSON.parse(localStorage.getItem("pvp_users") || "[]");
  }

  saveUsers(users: UserProfile[]) {
    localStorage.setItem("pvp_users", JSON.stringify(users));
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserByPhone(phone: string): UserProfile | undefined {
    return this.getUsers().find(u => u.phone === phone);
  }

  createUser(fullName: string, email: string, phone: string, password?: string): UserProfile {
    const users = this.getUsers();
    
    // Check if the registered email is the requested admin email, set its role to admin
    const isAdminEmail = email.toLowerCase() === "tomarvansh475@gmail.com";
    
    const newUser: UserProfile = {
      uid: `u_${Date.now()}`,
      fullName,
      email: email.toLowerCase(),
      phone,
      bio: isAdminEmail ? "पश्चिमांचल विकास परिषद के राष्ट्रीय मुख्य प्रचालक व प्रशासक।" : "पश्चिमांचल के विकास और प्रकृति संरक्षण के लिए समर्पित सैनिक।",
      role: isAdminEmail ? "admin" : "user",
      joinedCampaignIds: [],
      volunteeredPillars: [],
      createdAt: new Date().toISOString(),
      password: password || "user123"
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUserProfile(uid: string, data: Partial<Omit<UserProfile, "uid" | "role" | "createdAt">>): UserProfile | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...data
      };
      this.saveUsers(users);
      return users[index];
    }
    return null;
  }

  userJoinCampaign(uid: string, campaignId: string) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      if (!users[index].joinedCampaignIds.includes(campaignId)) {
        users[index].joinedCampaignIds.push(campaignId);
        this.saveUsers(users);
        this.pledgeToCampaign(campaignId);
      }
    }
  }

  userVolunteerPillar(uid: string, pillarTitle: string) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      if (!users[index].volunteeredPillars.includes(pillarTitle)) {
        users[index].volunteeredPillars.push(pillarTitle);
        this.saveUsers(users);
      }
    }
  }
}

export const dbInstance = new PVPDatabase();
