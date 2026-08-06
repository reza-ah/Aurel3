import Link from "next/link";
import Image from "next/image";
import {
    FaWhatsapp, FaCheckCircle, FaShieldAlt, FaTruck,
    FaPenNib, FaGem, FaMapMarkerAlt, FaAward, FaUsers,
    FaInstagram
} from "react-icons/fa";

export default async function CustomOrderPage({ params }: { params: Promise<{ locale: "en" | "fa" }> }) {
    const { locale } = await params;
    const isFa = locale === "fa";

    // ✅ مسیر اسکرین‌شات‌های واتساپ (فایل‌ها را در public/images/testimonials قرار دهید)
    // اگر تعداد بیشتری/کمتری دارید، این آرایه را کم و زیاد کنید
    const testimonialImages = [
        "/images/testimonials/1.jpg",
        "/images/testimonials/2.jpg",
        "/images/testimonials/3.jpg",
        "/images/testimonials/4.jpg",
    ];

    // ✅ سوالات متداول اختصاصی این صفحه (۱۳ سوال)
    const customFaqs = isFa ? [
        {
            q: "از کجا مطمئن باشم محصول نهایی همان چیزی است که سفارش داده‌ام؟",
            a: "قبل از شروع ساخت، طرح سه‌بعدی برای شما ارسال می‌شود و تنها پس از تأیید نهایی شما وارد مرحله ساخت خواهیم شد. همچنین در طول فرآیند، تصاویر و ویدئوهای مراحل مختلف برایتان ارسال می‌شود تا نتیجه نهایی دقیقاً مطابق طرح تأییدشده باشد."
        },
        {
            q: "چگونه از عیار و اصالت طلای ساخته‌شده مطمئن باشم؟",
            a: "تمامی محصولات با طلای استاندارد ساخته شده و دارای کد شناسایی (کد T) هستند که از طریق سامانه‌های مربوطه قابل استعلام است. همچنین فاکتور رسمی شامل وزن، عیار و مشخصات محصول به شما تحویل داده می‌شود."
        },
        {
            q: "چرا برای شروع سفارش پیش‌پرداخت دریافت می‌کنید؟",
            a: "با دریافت پیش‌پرداخت، زمان طراحی و ساخت برای سفارش شما رزرو می‌شود و فرآیند طراحی اختصاصی آغاز خواهد شد. از آنجا که طراحی هر سفارش کاملاً اختصاصی است و فقط برای یک مشتری انجام می‌شود، مبلغ پیش‌پرداخت صرف شروع این فرآیند خواهد شد."
        },
        {
            q: "مبلغ پیش‌پرداخت چگونه محاسبه می‌شود؟",
            a: "پیش‌پرداخت معادل ۱۰ درصد مبلغ نهایی سفارش است. به عنوان مثال اگر مبلغ نهایی سفارش شما ۱۰۰ میلیون تومان باشد، تنها ۱۰ میلیون تومان برای شروع فرآیند طراحی دریافت می‌شود و مابقی پس از پایان ساخت و قبل از ارسال تسویه خواهد شد."
        },
        {
            q: "اگر بعد از شروع طراحی منصرف شوم، پیش‌پرداخت برگردانده می‌شود؟",
            a: "تا قبل از شروع طراحی، امکان لغو سفارش وجود دارد. اما پس از آغاز طراحی، به دلیل صرف زمان و انجام خدمات اختصاصی، مبلغ پیش‌پرداخت قابل استرداد نیست."
        },
        {
            q: "آیا امکان پرداخت مرحله‌ای وجود دارد؟",
            a: "بله. تنها ۱۰ درصد مبلغ سفارش به عنوان پیش‌پرداخت دریافت می‌شود و ۹۰ درصد باقی‌مانده پس از اتمام ساخت، تأیید نهایی و پیش از ارسال تسویه خواهد شد."
        },
        {
            q: "اگر بعد از دیدن طرح بخواهم تغییراتی بدهم چه می‌شود؟",
            a: "تا پیش از شروع ساخت، امکان اعمال اصلاحات روی طرح وجود دارد. هدف ما این است که قبل از ورود به مرحله ساخت، طرح دقیقاً مطابق سلیقه و تأیید شما نهایی شود."
        },
        {
            q: "آیا می‌توانم طلای قدیمی یا سنگ‌های خودم را برای ساخت سفارش جدید استفاده کنم؟",
            a: "بله. طلای شما در حضور خودتان وزن و ثبت می‌شود و پس از تعیین عیار، ارزش آن از مبلغ نهایی سفارش کسر خواهد شد. در صورت تمایل، سنگ‌های شما نیز توسط گوهرشناس بررسی می‌شوند و در صورت مناسب بودن، در طراحی جدید استفاده خواهند شد."
        },
        {
            q: "طراحی و ساخت سفارش چقدر زمان می‌برد؟",
            a: "مدت زمان طراحی معمولاً بین ۴ تا ۷ روز کاری است. پس از تأیید نهایی طرح، ساخت محصول بسته به پیچیدگی آن معمولاً ۱۰ تا ۱۵ روز کاری زمان نیاز دارد. زمان دقیق هنگام ثبت سفارش به شما اعلام خواهد شد."
        },
        {
            q: "اگر در شهر دیگری باشم، چگونه سفارش ثبت کنم؟",
            a: "تمام مراحل، از مشاوره و طراحی تا تأیید نهایی، به‌صورت آنلاین انجام می‌شود. محصول نهایی نیز با بسته‌بندی ایمن و بیمه‌شده به سراسر کشور ارسال خواهد شد."
        },
        {
            q: "آیا عکس‌ها، طرح‌ها و اطلاعاتی که برای شما ارسال می‌کنم محرمانه باقی می‌مانند؟",
            a: "بله. تمامی تصاویر، طرح‌ها و اطلاعات مشتریان کاملاً محرمانه هستند و بدون اجازه شما در هیچ رسانه یا شبکه اجتماعی منتشر نخواهند شد."
        },
        {
            q: "آیا امکان مراجعه حضوری وجود دارد؟",
            a: "بله. در صورت هماهنگی قبلی می‌توانید برای مشاوره، بررسی نمونه‌ها یا تحویل سفارش به دفتر AUREL مراجعه کنید."
        },
        {
            q: "اگر محصول نهایی با طرح تأییدشده مطابقت نداشته باشد چه اتفاقی می‌افتد؟",
            a: "اگر محصول نهایی با طرحی که پیش از ساخت توسط شما تأیید شده، مغایرت اساسی داشته باشد، موضوع بررسی شده و در صورت تأیید، اصلاح یا بازسازی محصول بدون دریافت هزینه انجام خواهد شد."
        },
    ] : [
        {
            q: "How can I be sure the final product is exactly what I ordered?",
            a: "Before production begins, the 3D design is sent to you, and we only proceed to manufacturing after your final approval. Throughout the process, images and videos of each stage are shared with you to ensure the final result matches the approved design precisely."
        },
        {
            q: "How can I verify the purity and authenticity of the gold?",
            a: "All pieces are crafted with standard-purity gold and carry an identification code (T-code) that can be verified through the relevant official systems. You will also receive an official invoice detailing the weight, purity, and specifications of your product."
        },
        {
            q: "Why do you require a deposit to start an order?",
            a: "The deposit reserves design and production time for your order and initiates the bespoke design process. Since each design is entirely custom and created exclusively for one client, the deposit covers the start of this dedicated process."
        },
        {
            q: "How is the deposit amount calculated?",
            a: "The deposit equals 10% of the final order amount. For example, if your final order totals 100 million tomans, only 10 million tomans is collected to begin the design process, and the remainder is settled after production is complete and before shipping."
        },
        {
            q: "If I change my mind after the design has started, is the deposit refundable?",
            a: "You may cancel your order before the design process begins. However, once design work has started, the deposit is non-refundable due to the time and dedicated services already invested."
        },
        {
            q: "Is installment payment available?",
            a: "Yes. Only 10% of the order amount is collected as a deposit, and the remaining 90% is settled after production is complete, following final approval and before shipping."
        },
        {
            q: "What if I want to make changes after seeing the design?",
            a: "Revisions can be made before production begins. Our goal is to finalize the design exactly to your taste and approval before moving into the manufacturing stage."
        },
        {
            q: "Can I use my own old gold or gemstones for a new custom order?",
            a: "Yes. Your gold is weighed and recorded in your presence, and once its purity is determined, its value is deducted from the final order amount. If you wish, your gemstones will also be examined by a gemologist and, if suitable, incorporated into the new design."
        },
        {
            q: "How long does the design and production take?",
            a: "Design typically takes 4 to 7 business days. After final approval, production usually requires 10 to 15 business days depending on complexity. The exact timeline is provided when your order is placed."
        },
        {
            q: "If I live in another city, how can I place an order?",
            a: "The entire process—from consultation and design to final approval—is handled online. The finished product is then shipped nationwide with secure, insured packaging."
        },
        {
            q: "Will the photos, designs, and information I send you remain confidential?",
            a: "Yes. All client images, designs, and information are kept strictly confidential and will never be published on any media or social network without your permission."
        },
        {
            q: "Is an in-person visit possible?",
            a: "Yes. With prior coordination, you can visit the AUREL office for consultation, to review samples, or to collect your order."
        },
        {
            q: "What happens if the final product does not match the approved design?",
            a: "If the final product has a significant discrepancy from the design you approved before production, the matter will be reviewed, and if confirmed, the product will be corrected or remade at no additional cost."
        },
    ];

    const content = isFa ? {
        subtitle: "طراحی و ساخت جواهرات سفارشی",

        title1: "جواهری منحصربه‌فرد",
        title2: "از ایده تا",
        title3: "واقعیت",

        desc: "در استودیو AUREL، ایده شما با طراحی سه‌بعدی تخصصی، مدلسازی دقیق و ساخت حرفه‌ای به جواهری تبدیل می‌شود که هم از نظر زیبایی و هم کیفیت ساخت، ماندگار باشد.",

        btnConsult: "شروع مشاوره رایگان",
        btnPortfolio: "مشاهده نمونه‌کارها",
        stats: [
            { icon: "award", value: "۱۵+", label: "سال تجربه" },
            { icon: "gem", value: "۵۰۰۰+", label: "پروژه انجام شده" },
            { icon: "users", value: "+100", label: "مشتری و همکار" },
            { icon: "shield", value: "اینماد", label: "دارای نماد اعتماد الکترونیکی" },
        ],

        processTitle: "فرآیند سفارش",
        processDesc:
            "از مشاوره اولیه تا تحویل نهایی، همه مراحل با شفافیت کامل و تأیید شما انجام می‌شود.",
        process: [
            {
                step: "۰۱",
                title: "مشاوره و بررسی ایده",
                desc: "ایده، عکس یا نمونه موردنظر خود را برای ما ارسال کنید تا درباره طراحی، امکان ساخت، زمان و هزینه با شما مشورت کنیم."
            },
            {
                step: "۰۲",
                title: "شروع طراحی",
                desc: "پس از تأیید شرایط سفارش، طراحی سه‌بعدی پروژه آغاز می‌شود."
            },
            {
                step: "۰۳",
                title: "بررسی و تأیید طراحی",
                desc: "رندرها و تصاویر مدل سه‌بعدی برای شما ارسال می‌شود و پس از تأیید نهایی، پروژه وارد مرحله تولید خواهد شد."
            },
            {
                step: "۰۴",
                title: "ساخت و کنترل کیفیت",
                desc: "جواهر با استفاده از متریال استاندارد ساخته شده و پیش از تحویل، از نظر کیفیت ساخت، پرداخت و جزئیات بررسی می‌شود."
            },
            {
                step: "۰۵",
                title: "تسویه و تحویل",
                desc: "پس از آماده شدن سفارش و تأیید نهایی، تسویه انجام شده و محصول با بسته‌بندی ایمن و در صورت نیاز به‌صورت بیمه‌شده ارسال می‌شود."
            }
        ],

        trustTitle: "چرا به AUREL اعتماد کنید؟",
        trustDesc: "ما تلاش می‌کنیم با شفافیت، تخصص و پاسخ‌گویی، تجربه‌ای مطمئن از سفارش جواهرات سفارشی برای شما فراهم کنیم.",
        trust: [
            { title: "تضمین اصالت و شفافیت", desc: " ارائه فاکتور  شامل مشخصات کامل سفارش، وزن، عیار طلا، اطلاعات سنگ‌ها و جزئیات خدمات انجام‌شده." },
            { title: "تأیید نهایی پیش از تولید", desc: "پیش از شروع ساخت، رندر سه‌بعدی یا فایل نهایی برای بررسی و تأیید شما ارسال می‌شود تا محصول دقیقاً مطابق انتظار اجرا شود." },
            { title: "پشتیبانی پس از تحویل", desc: "در کنار شما هستیم؛ از پاسخگویی به سؤالات و مشاوره گرفته تا خدمات پس از فروش و نگهداری، متناسب با نوع سفارش." },
            { title: "ارسال امن به سراسر کشور", desc: "تمام سفارش‌های فیزیکی با بسته‌بندی ایمن، بیمه و کد رهگیری ارسال می‌شوند تا با اطمینان به دست شما برسند." },
        ],
        credibilityTitle: "اعتماد، مهم‌ترین سرمایه ما",
        credibilityDesc:
            "AUREL با فعالیت رسمی، حضور فیزیکی در بازار جواهرات تهران و سال‌ها تجربه در طراحی و ساخت جواهرات، خدمات خود را با شفافیت و مسئولیت‌پذیری ارائه می‌کند.",

        enamadTitle: "دارای نماد اعتماد الکترونیکی",
        enamadDesc:
            "وب‌سایت AUREL دارای نماد اعتماد الکترونیکی (اینماد) است و سفارش‌ها در بستری امن و قابل پیگیری ثبت و مدیریت می‌شوند.",

        addressTitle: "حضور فیزیکی در بازار جواهرات تهران",
        addressDesc:
            "دفتر و استودیوی طراحی AUREL در پاساژ گلشن، چهارراه استانبول تهران واقع شده است. برای مشاوره حضوری، هماهنگی و تحویل سفارش می‌توانید با تعیین وقت قبلی مراجعه کنید.",

        addressFull:
            "تهران، چهارراه استانبول، پاساژ گلشن، طبقه اول، واحد ۸۱",

        renderTitle: "آنچه تأیید می‌کنید، همان چیزی است که ساخته می‌شود",
        renderLabel1: "مدل سه‌بعدی",
        renderLabel2: "محصول نهایی",

        testimonialsTitle: "تجربه مشتریان",
        testimonialsSubtitle:
            "بخشی از پیام‌ها و بازخورد مشتریانی که به AUREL اعتماد کرده‌اند.",

        pricingTitle: "تعرفه شفاف، بدون هزینه پنهان",

        pricing: [
            {
                value: "۱۸ تا ۲۸٪",
                title: "اجرت ساخت",
                desc: "اجرت ساخت با توجه به پیچیدگی طرح، نوع ساخت و جزئیات اجرا محاسبه می‌شود."
            },
            {
                value: "رایگان",
                title: "طراحی و مدلسازی",
                desc: "در سفارش‌های ساخت، هزینه طراحی، مدلسازی سه‌بعدی و پرینت  به‌صورت جداگانه دریافت نمی‌شود و در اجرت ساخت لحاظ شده است."
            },
            {
                value: "۱۰٪",
                title: "پیش‌پرداخت",
                desc: "برای شروع طراحی و رزرو زمان تولید، ۱۰٪ از مبلغ کل سفارش دریافت می‌شود."
            },
            {
                value: "۹۰٪",
                title: "تسویه نهایی",
                desc: "پس از اتمام ساخت، ارسال تصاویر نهایی و تأیید سفارش، مبلغ باقیمانده پیش از ارسال تسویه می‌شود."
            }
        ],

        faqTitle: "سوالات متداول سفارش اختصاصی",
        finalTitle: "آماده‌اید جواهر منحصربه‌فرد خود را بسازید؟",
        finalDesc: "همین حالا با کارشناسان ما در ارتباط باشید. مشاوره اولیه کاملاً رایگان است.",
        waText: "سلام، می‌خواهم در مورد ساخت یک سفارش اختصاصی مشاوره بگیرم."
    } : {
        subtitle: "Bespoke Jewelry",
        title1: "Build Your Dream Jewelry",
        title2: "From Concept",
        title3: "To Reality",
        desc: "At AUREL Studio, we combine 3D design artistry with master craftsmanship to create unique pieces tailored exactly to your taste and story.",
        btnConsult: "Start Free Consultation",
        btnPortfolio: "View Completed Projects",

        stats: [
            { icon: "award", value: "15+", label: "Years of Experience" },
            { icon: "gem", value: "5000+", label: "Design Orders" },
            { icon: "users", value: "Hundreds", label: "Clients Across Iran" },
            { icon: "shield", value: "Certified", label: "E-Namad Trust Seal" },
        ],

        processTitle: "Transparent Ordering Process",
        processDesc: "From the first idea to final delivery, every step proceeds with full transparency and your approval.",
        process: [
            { step: "01", title: "Free Consultation", desc: "Share your idea, photo, or sketch via WhatsApp. The initial consultation is completely free." },
            { step: "02", title: "10% Deposit & Design Start", desc: "After agreeing on the design, only 10% of the total amount is required as a deposit to begin the 3D design process." },
            { step: "03", title: "Step-by-Step Approval", desc: "During 3D modeling and sample printing, images and videos are sent to you for approval before moving forward." },
            { step: "04", title: "Final Workshop Production", desc: "After final approval, your jewelry is crafted, hallmarked, and quality-checked to the highest standards." },
            { step: "05", title: "90% Settlement & Delivery", desc: "After sending photos of the final product, the remaining 90% is settled, and the piece is shipped fully insured." },
        ],

        trustTitle: "Why Trust AUREL?",
        trustDesc: "Your trust is our most valuable asset. We stand by you with full transparency and the backing of official licenses.",
        trust: [
            { title: "Guaranteed Purity & Authenticity", desc: "Official invoice with exact weight, standard gold/gemstone purity, and a valid maker's T-code." },
            { title: "Design Approval Before Production", desc: "We send a detailed 3D render for your final approval before any manufacturing begins." },
            { title: "After-Sales Service Warranty", desc: "Ongoing support, free replating, and maintenance services to ensure lasting brilliance." },
            { title: "Fully Insured Shipping", desc: "Secure packaging and insured delivery nationwide with a tracking code." },
        ],

        credibilityTitle: "Our Credibility Backing",
        credibilityDesc: "AUREL Studio, with official licenses and located in the heart of Tehran's jewelry market, is ready to provide professional services.",
        enamadTitle: "E-Namad (Electronic Trust Seal)",
        enamadDesc: "Our activities are conducted under the supervision of the Ministry of Industry, Mine and Trade, holding the Electronic Trust Seal.",
        addressTitle: "Physical Presence in Tehran's Jewelry Market",
        addressDesc: "Our studio and workshop are located in Golshan Passage, Istanbul Crossroads, Tehran. You can visit us for in-person consultation.",
        addressFull: "Golshan Passage, 1st Floor, No. 81, Istanbul Crossroads, Tehran, Iran",

        renderTitle: "What We Design Is What You Get",
        renderLabel1: "3D Design",
        renderLabel2: "Final Manufactured Product",

        testimonialsTitle: "What Our Clients Say",
        testimonialsSubtitle: "Real screenshots from clients who trusted us",

        pricingTitle: "Transparent Pricing, No Hidden Costs",
        pricing: [
            { value: "18-28%", title: "Making Charge", desc: "Calculated based on design complexity. This includes all production stages." },
            { value: "Free", title: "Design & 3D Modeling", desc: "No separate charges for 3D design, modeling, or printing; it is fully included in the making charge." },
            { value: "10%", title: "Initial Deposit", desc: "Only 10% of the total amount is required to start the design process and reserve workshop time." },
            { value: "90%", title: "Final Settlement", desc: "The remaining 90% is paid after production is complete and final photos are approved, before shipping." },
        ],

        faqTitle: "Custom Order FAQ",
        finalTitle: "Ready to Create Your Unique Jewelry?",
        finalDesc: "Get in touch with our experts right now. The initial consultation is completely free.",
        waText: "Hello, I would like to consult about making a custom jewelry order."
    };

    const trustIcons = [<FaShieldAlt />, <FaPenNib />, <FaCheckCircle />, <FaTruck />];
    const statIcons: Record<string, React.ReactNode> = {
        award: <FaAward className="text-3xl" />,
        gem: <FaGem className="text-3xl" />,
        users: <FaUsers className="text-3xl" />,
        shield: <FaShieldAlt className="text-3xl" />,
    };
    const waLink = `https://wa.me/989122987123?text=${encodeURIComponent(content.waText)}`;

    return (
        <div dir={isFa ? "rtl" : "ltr"} className="relative z-10 w-full">

            {/* ✅ 1. Hero Section */}
            <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#D4AF37]">
                        {content.subtitle}
                    </p>
                    <h1 className={`persian-smooth mb-6 text-4xl font-light leading-tight text-white md:text-6xl ${!isFa ? "font-serif" : ""}`}>
                        {content.title1} <br />
                        <span className="text-[#D4AF37]">{content.title2}</span> <br />
                        {content.title3}
                    </h1>
                    <p className="persian-smooth mx-auto mb-10 max-w-2xl text-lg leading-8 text-[#a3a3a3]">
                        {content.desc}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 text-base font-medium text-black transition-all duration-300 hover:bg-[#b5952f] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        >
                            <FaWhatsapp className="text-xl" />
                            {content.btnConsult}
                        </a>
                        <a
                            href="https://www.instagram.com/aureldesignstudio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 text-base font-medium text-black transition-all duration-300 hover:bg-[#b5952f] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        >
                            <FaInstagram className="text-xl" />
                            {content.btnPortfolio}
                        </a>
                    </div>
                </div>
            </section>

            {/* ✅ 2. آمار (اعتبار فوری) */}
            <section className="border-y border-white/5 bg-white/[0.02] py-16 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
                        {content.stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="mb-4 flex justify-center text-[#D4AF37]">
                                    {statIcons[stat.icon]}
                                </div>
                                <div className="text-3xl font-light text-white md:text-4xl">{stat.value}</div>
                                <div className="persian-smooth mt-2 text-sm text-[#a3a3a3]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ 3. فرآیند شفاف (۵ مرحله) */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "مراحل کار" : "Our Process"}
                        </p>
                        <h2 className="text-3xl font-light text-white md:text-4xl">{content.processTitle}</h2>
                        <p className="persian-smooth mx-auto mt-4 max-w-2xl text-base text-[#a3a3a3]">
                            {content.processDesc}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {content.process.map((step, index) => (
                            <div
                                key={index}
                                className={`group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] ${isFa ? "text-right" : "text-left"} ${index === 4 ? "md:col-span-2 md:max-w-md md:mx-auto" : ""}`}
                            >
                                <div className={`absolute top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-sm font-medium text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-black ${isFa ? "left-6" : "right-6"}`}>
                                    {step.step}
                                </div>
                                <div className={isFa ? "pl-16" : "pr-16"}>
                                    <h3 className="mb-3 text-xl font-medium text-white">{step.title}</h3>
                                    <p className="persian-smooth text-base leading-8 text-[#a3a3a3]">{step.desc}</p>
                                </div>
                                {index % 2 === 0 && index < content.process.length - 2 && (
                                    <div className={`absolute top-1/2 hidden h-px w-6 bg-gradient-to-r from-[#D4AF37]/40 to-transparent md:block ${isFa ? "-left-6" : "-right-6"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ 4. Trust Badges (چرا اعتماد کنند) */}
            <section className="border-y border-white/5 bg-white/[0.02] py-24 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "اعتماد و اطمینان" : "Trust & Confidence"}
                        </p>
                        <h2 className="text-3xl font-light text-white md:text-4xl">{content.trustTitle}</h2>
                        <p className="persian-smooth mx-auto mt-4 max-w-2xl text-base text-[#a3a3a3]">
                            {content.trustDesc}
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {content.trust.map((badge, index) => (
                            <div key={index} className="flex flex-col items-center text-center rounded-2xl border border-white/5 bg-white/[0.01] p-6 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.03]">
                                <div className="mb-4 rounded-full bg-[#D4AF37]/10 p-4 text-[#D4AF37]">{trustIcons[index]}</div>
                                <h3 className="mb-2 text-lg font-medium text-white">{badge.title}</h3>
                                <p className="persian-smooth text-sm leading-7 text-[#a3a3a3]">{badge.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ 5. بخش اعتبار: اینماد + آدرس */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "پشتوانه اعتبار" : "Credibility Backing"}
                        </p>
                        <h2 className="text-3xl font-light text-white md:text-4xl">{content.credibilityTitle}</h2>
                        <p className="persian-smooth mx-auto mt-4 max-w-2xl text-base text-[#a3a3a3]">
                            {content.credibilityDesc}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* کارت اینماد */}
                        <div className="group rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                                    <FaAward className="text-2xl" />
                                </div>
                                <h3 className="text-xl font-medium text-white">{content.enamadTitle}</h3>
                            </div>
                            <p className="persian-smooth text-base leading-8 text-[#a3a3a3]">{content.enamadDesc}</p>
                            <div className="mt-6 flex items-center gap-2 text-sm text-[#D4AF37]">
                                <FaCheckCircle className="text-[#D4AF37]" />
                                <span className="persian-smooth">{isFa ? "دارای مجوز رسمی از وزارت صنعت، معدن و تجارت" : "Officially licensed by the Ministry of Industry, Mine and Trade"}</span>
                            </div>

                            {isFa && (
                                <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-6">
                                    <p className="persian-smooth text-xs text-[#a3a3a3]">برای استعلام، روی نماد زیر کلیک کنید:</p>
                                    {/* ✅ نماد اعتماد الکترونیکی — کد رسمی اینماد */}
                                    {/* ✅ نماد اعتماد الکترونیکی — کد رسمی اینماد */}
                                    <a
                                        referrerPolicy="origin"
                                        target="_blank"
                                        href="https://trustseal.enamad.ir/?id=766862&Code=bNk0v10FexAm3ee2vi3LR9Q0dpW0ONGL"
                                        className="inline-block rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-white/10"
                                    >
                                        <img
                                            referrerPolicy="origin"
                                            src="https://trustseal.enamad.ir/logo.aspx?id=766862&Code=bNk0v10FexAm3ee2vi3LR9Q0dpW0ONGL"
                                            alt=""
                                            style={{ cursor: "pointer" }}
                                            {...({ code: "bNk0v10FexAm3ee2vi3LR9Q0dpW0ONGL" } as any)}
                                            className="h-auto w-24"
                                        />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* کارت آدرس */}
                        <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/30">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                                    <FaMapMarkerAlt className="text-2xl" />
                                </div>
                                <h3 className="text-xl font-medium text-white">{content.addressTitle}</h3>
                            </div>
                            <p className="persian-smooth text-base leading-8 text-[#a3a3a3]">{content.addressDesc}</p>
                            <Link
                                href="https://www.google.com/maps/search/?api=1&query=35.694517,51.418968"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-5 py-2.5 text-sm text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
                            >
                                <FaMapMarkerAlt />
                                <span className="persian-smooth">{content.addressFull}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ✅ 6. Render vs Reality */}
            <section className="border-y border-white/5 bg-white/[0.02] py-24 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "تضمین کیفیت" : "Quality Guarantee"}
                        </p>
                        <h2 className="text-3xl font-light text-white md:text-4xl">{content.renderTitle}</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* کارت اول - رندر */}
                        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-[#D4AF37]/30">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-px w-8 bg-[#D4AF37]" />
                                <span className={`text-xs tracking-[0.2em] text-[#D4AF37] ${!isFa ? "uppercase" : ""}`}>
                                    {content.renderLabel1}
                                </span>
                            </div>
                            <div className="relative w-full overflow-hidden rounded-xl bg-zinc-800/40">
                                <Image
                                    src="/images/DesignedModel.jpg"
                                    alt="3D Render"
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                            </div>
                            <div className="mt-5">
                                <h3 className="text-lg font-medium text-white">{isFa ? "فایل طراحی شده" : "Designed File"}</h3>
                                <p className="persian-smooth mt-2 text-sm text-[#a3a3a3]">
                                    {isFa ? "طراحی دقیق و با جزئیات قبل از ساخت" : "Precise, detailed design before production"}
                                </p>
                            </div>
                        </div>

                        {/* کارت دوم - محصول نهایی */}
                        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-[#D4AF37]/30">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-px w-8 bg-[#D4AF37]" />
                                <span className={`text-xs tracking-[0.2em] text-[#D4AF37] ${!isFa ? "uppercase" : ""}`}>
                                    {content.renderLabel2}
                                </span>
                            </div>
                            <div className="relative w-full overflow-hidden rounded-xl bg-zinc-800/40">
                                <Image
                                    src="/images/Result.jpg"
                                    alt="Final Product"
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                            </div>
                            <div className="mt-5">
                                <h3 className="text-lg font-medium text-white">{isFa ? "محصول نهایی" : "Final Product"}</h3>
                                <p className="persian-smooth mt-2 text-sm text-[#a3a3a3]">
                                    {isFa ? "خروجی نهایی با همان جزئیات، درخشش و کیفیت تایید شده" : "Final output with the exact approved details, brilliance, and quality"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ✅ 7. نظرات مشتریان (اسکرین‌شات واتساپ — فقط تصویر) */}
            <section className="relative py-24 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "تجربه مشتریان" : "Client Experiences"}
                        </p>
                        <h2 className="text-3xl font-light text-white md:text-5xl">{content.testimonialsTitle}</h2>
                        <p className="persian-smooth mx-auto mt-4 max-w-2xl text-base text-[#a3a3a3]">
                            {content.testimonialsSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
                        {testimonialImages.map((src, index) => (
                            <div
                                key={index}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0b141a] shadow-lg shadow-black/40 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4AF37]/40 hover:shadow-[0_16px_45px_rgba(212,175,55,0.14)]"
                            >
                                <img
                                    src={src}
                                    alt={isFa ? `اسکرین‌شات پیام مشتری ${index + 1}` : `Client message screenshot ${index + 1}`}
                                    loading="lazy"
                                    className="block w-full h-auto bg-[#0b141a] transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ 8. بخش تعرفه شفاف */}
            <section className="border-y border-white/5 bg-white/[0.02] py-24 px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-16 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "شفافیت مالی" : "Financial Transparency"}
                        </p>
                        <h2 className="text-3xl font-light text-white md:text-4xl">{content.pricingTitle}</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {content.pricing.map((item, index) => (
                            <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.04]">
                                <div className="mb-4 text-4xl font-light text-[#D4AF37]">{item.value}</div>
                                <h3 className="mb-3 text-lg font-medium text-white">{item.title}</h3>
                                <p className="persian-smooth text-sm leading-7 text-[#a3a3a3]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ 9. FAQ اختصاصی (۱۳ سوال) */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "پاسخ به سوالات شما" : "Answers to Your Questions"}
                        </p>
                        <h2 className="text-3xl font-light text-white">{content.faqTitle}</h2>
                    </div>
                    <div className="space-y-4">
                        {customFaqs.map((faq, index) => (
                            <details key={index} className="group rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-300 open:border-[#D4AF37]/30 open:bg-white/[0.04]">
                                <summary className="flex cursor-pointer items-center justify-between p-6 text-base font-medium text-white outline-none">
                                    <span className="persian-smooth">{faq.q}</span>
                                    <span className={`text-[#D4AF37] transition-transform duration-300 group-open:rotate-180 ${isFa ? "mr-4" : "ml-4"}`}>▼</span>
                                </summary>
                                <div className={`px-6 pb-6 ${isFa ? "text-right" : "text-left"}`}>
                                    <p className="persian-smooth text-base leading-8 text-[#a3a3a3]">{faq.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ 10. Final CTA */}
            <section className="border-t border-white/10 bg-gradient-to-b from-[#050505] to-[#0a0a0a] py-20 px-6 text-center">
                <div className="mx-auto max-w-3xl">
                    <FaGem className="mx-auto mb-6 text-4xl text-[#D4AF37]" />
                    <h2 className="mb-6 text-3xl font-light text-white md:text-4xl">{content.finalTitle}</h2>
                    <p className="persian-smooth mb-10 text-lg text-[#a3a3a3]">{content.finalDesc}</p>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-full bg-[#D4AF37] px-10 py-4 text-lg font-medium text-black transition-all duration-300 hover:bg-[#b5952f] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
                    >
                        <FaWhatsapp className="text-2xl" />
                        {isFa ? "شروع گفتگو در واتس‌اپ" : "Start Chat on WhatsApp"}
                    </a>
                </div>
            </section>

            {/* ✅ 11. Floating WhatsApp Button */}
            <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Contact"
                className={`fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] ${isFa ? "left-6" : "right-6"}`}
            >
                <FaWhatsapp className="text-3xl" />
            </a>
        </div>
    );
}