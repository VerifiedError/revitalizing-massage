export interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationMinutes: number;
  price: number;
  hasAddons: boolean;
  addons?: string[];
}

export const services: Service[] = [
  {
    id: "30-minute-massage",
    title: "30 Minute Massage",
    description: "This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don't want full body work. Since many of us store tension in our upper back and neck, this is a typical complaint and focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.",
    duration: "45 mins",
    durationMinutes: 45,
    price: 45,
    hasAddons: false
  },
  {
    id: "30-minute-massage-addon",
    title: "30 Minute Massage with Add-on",
    description: "This is typically focused on an area of complaint and does not include the whole body. This is a perfect appointment for you if you are limited on time or don't want full body work. Since many of us store tension in our upper back and neck, this is the perfect area of focus for a 30 minute session. This is also a good length of time to focus on shoulder complaints and work on the tight muscles of the chest, neck and upper back to help free the shoulder joint.",
    duration: "45 mins",
    durationMinutes: 45,
    price: 55,
    hasAddons: true,
    addons: ["Essential Oils", "CBD Oil", "Exfoliation", "Hot Stones"]
  },
  {
    id: "60-minute-massage",
    title: "60 Minute Massage",
    description: "A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area, 7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.",
    duration: "1 hr 15 mins",
    durationMinutes: 75,
    price: 70,
    hasAddons: false
  },
  {
    id: "60-minute-massage-addon",
    title: "60 Minute Massage with Add-on",
    description: "A 60 minute session allows enough time for full body work. A typical session would involve approximately 20 minutes on the back and neck area, 7-8 minutes on each arm and leg and 10 minutes to the upper neck, scalp and face. This is an approximate time frame and varies from appointment to appointment depending on where you may have complaints that need focus work.",
    duration: "1 hr 15 mins",
    durationMinutes: 75,
    price: 80,
    hasAddons: true,
    addons: ["Essential Oils", "CBD Oil", "Exfoliation", "Hot Stones"]
  },
  {
    id: "75-minute-massage",
    title: "75 Minute Massage",
    description: "A 75 minute session provides extra time beyond the standard 60 minute massage, allowing for more thorough work on problem areas while still covering full body massage. Perfect for those who need a bit more time for relaxation and therapeutic benefits.",
    duration: "1 hr 15 mins",
    durationMinutes: 75,
    price: 85,
    hasAddons: false
  },
  {
    id: "75-minute-massage-addon",
    title: "75 Minute Massage with Add-on",
    description: "A 75 minute session provides extra time beyond the standard 60 minute massage, allowing for more thorough work on problem areas while still covering full body massage. Perfect for those who need a bit more time for relaxation and therapeutic benefits.",
    duration: "1 hr 15 mins",
    durationMinutes: 75,
    price: 85,
    hasAddons: true,
    addons: ["Essential Oils", "CBD Oil", "Exfoliation", "Hot Stones"]
  },
  {
    id: "90-minute-massage",
    title: "90 Minute Massage",
    description: "It is very much like the 60 minute session, however, it allows a little extra time for each area. This is great for you when you feel like that last 60 minute massage \"was just not long enough.\" About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.",
    duration: "1 hr 45 mins",
    durationMinutes: 105,
    price: 100,
    hasAddons: false
  },
  {
    id: "90-minute-massage-addon",
    title: "90 Minute Massage with Add-on",
    description: "It is very much like the 60 minute session, however, it allows a little extra time for each area. This is great for you when you feel like that last 60 minute massage \"was just not long enough.\" About 45 minutes would be allotted to the back and neck area, or other area of complaint. Each arm and leg also has a little extra time for some focus work or deep tissue work. Many people enjoy this as it allows enough time to slow down, relax and benefit from the therapeutic effects of massage therapy.",
    duration: "1 hr 45 mins",
    durationMinutes: 105,
    price: 110,
    hasAddons: true,
    addons: ["Essential Oils", "CBD Oil", "Exfoliation", "Hot Stones"]
  },
  {
    id: "prenatal-massage",
    title: "Prenatal Massage",
    description: "Prenatal sessions include full-body massage with the added comfort of pillows to provide that added comfort and security! Prenatal sessions are light to light-medium pressure, no deep tissue will be offered.",
    duration: "1 hr 15 mins",
    durationMinutes: 75,
    price: 75,
    hasAddons: false
  },
  {
    id: "chair-massage",
    title: "15-Minute Chair Massage",
    description: "You can come in and receive a 15 minute chair massage or for an additional travel fee I can come to you! Perfect for quick stress relief and relaxation.",
    duration: "15 mins",
    durationMinutes: 15,
    price: 20,
    hasAddons: false
  }
];

export const addons = [
  { id: "essential-oils", name: "Essential Oils", price: 10 },
  { id: "cbd-oil", name: "CBD Oil", price: 10 },
  { id: "exfoliation", name: "Exfoliation", price: 10 },
  { id: "hot-stones", name: "Hot Stones", price: 10 }
];

export const businessInfo = {
  name: "Revitalizing Massage",
  phone: "+1 785-250-4599",
  phoneDisplay: "(785) 250-4599",
  email: "alannahsrevitalizingmassage@gmail.com",
  address: {
    street: "2900 SW Atwood",
    city: "Topeka",
    state: "KS",
    zip: "66614",
    full: "2900 SW Atwood, Topeka, KS 66614"
  },
  hours: {
    weekdays: "By Appointment",
    saturday: "By Appointment",
    sunday: "Closed"
  }
};
