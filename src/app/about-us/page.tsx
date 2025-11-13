import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DynamicFAQ from '../../components/DynamicFAQ';
import { CartProvider } from '../../context/CartContext';
import { PageService } from '@/lib/services';
import Image from 'next/image';
import AnimatedCounter from '../../components/AnimatedCounter';
import VideoPlayer from '../../components/VideoPlayer';

type StatData = {
  value: number;
  suffix: string;
  label: string;
}

type FeatureData = {
  icon?: string;
  title: string;
}

type AboutContent = {
  videoUrl?: string;
  videoThumbnail?: string;
  videoThumbnailAlt?: string;
  stats: StatData[];
  whoWeAreHeading?: string;
  whoWeAreContent?: string;
  whoWeAreImage?: string;
  whyChooseUsHeading?: string;
  whyChooseUsDescription?: string;
  whyChooseUsTeamImage?: string;
  whyChooseUsFeatures: FeatureData[];
}

function extractArray(source: Record<string, unknown>, key: string) {
  const value = source[key]
  return Array.isArray(value)
    ? (value.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null))
    : []
}

function extractAboutContent(content: Record<string, unknown> | null | undefined): AboutContent {
  if (!content || typeof content !== 'object') {
    return { stats: [], whyChooseUsFeatures: [] }
  }

  const data = content as Record<string, unknown>

  const stats = extractArray(data, 'stats')
    .map((item) => {
      const valueStr = typeof item.value === 'string' ? item.value : typeof item.value === 'number' ? String(item.value) : undefined
      const value = valueStr ? parseInt(valueStr, 10) : undefined
      const suffix = typeof item.suffix === 'string' ? item.suffix : '+'
      const label = typeof item.label === 'string' ? item.label : undefined

      if (value === undefined || !label) {
        return null
      }

      return {
        value,
        suffix,
        label,
      } satisfies StatData
    })
    .filter((item): item is StatData => item !== null)

  const features = extractArray(data, 'whyChooseUsFeatures')
    .map((item) => {
      const title = typeof item.title === 'string' ? item.title : undefined
      if (!title) {
        return null
      }

      return {
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        title,
      } as FeatureData
    })
    .filter((item): item is FeatureData => item !== null)

  return {
    videoUrl: typeof data.videoUrl === 'string' ? data.videoUrl : undefined,
    videoThumbnail: typeof data.videoThumbnail === 'string' ? data.videoThumbnail : undefined,
    videoThumbnailAlt: typeof data.videoThumbnailAlt === 'string' ? data.videoThumbnailAlt : 'About Three Star Foods',
    stats,
    whoWeAreHeading: typeof data.whoWeAreHeading === 'string' ? data.whoWeAreHeading : 'Who We Are',
    whoWeAreContent: typeof data.whoWeAreContent === 'string' ? data.whoWeAreContent : undefined,
    whoWeAreImage: typeof data.whoWeAreImage === 'string' ? data.whoWeAreImage : undefined,
    whyChooseUsHeading: typeof data.whyChooseUsHeading === 'string' ? data.whyChooseUsHeading : 'Why Choose Us',
    whyChooseUsDescription: typeof data.whyChooseUsDescription === 'string' ? data.whyChooseUsDescription : undefined,
    whyChooseUsTeamImage: typeof data.whyChooseUsTeamImage === 'string' ? data.whyChooseUsTeamImage : undefined,
    whyChooseUsFeatures: features,
  }
}

export default async function AboutPage() {
  const page = await PageService.getPageBySlug('about-us')

  const cmsContent =
    page && typeof page.content === 'object' && page.content !== null
      ? (page.content as Record<string, unknown>)
      : undefined

  const aboutContent = page && page.status === 'PUBLISHED'
    ? extractAboutContent(cmsContent)
    : { stats: [], whyChooseUsFeatures: [] }

  // Default fallback values
  const defaultStats: StatData[] = [
    { value: 100, suffix: '+', label: 'Food Items' },
    { value: 3000, suffix: '+', label: 'Happy Customers' },
    { value: 15, suffix: '+', label: 'Years' },
  ]

  const defaultFeatures: FeatureData[] = [
    { icon: '/images/quality.webp', title: 'Uncompromising Quality' },
    { icon: '/images/quality.webp', title: 'Punctuality' },
    { icon: '/images/quality.webp', title: 'Punctuality' },
    { icon: '/images/quality.webp', title: 'Punctuality' },
    { icon: '/images/quality.webp', title: 'Punctuality' },
    { icon: '/images/quality.webp', title: 'Punctuality' },
  ]

  const stats = aboutContent.stats.length > 0 ? aboutContent.stats : defaultStats
  const features = aboutContent.whyChooseUsFeatures.length > 0 ? aboutContent.whyChooseUsFeatures : defaultFeatures

  return (
    <CartProvider>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="w-full mx-auto 2xl:container">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora capitalize">About Us</h1>
          </div>
        </div>
      </div>

      {(aboutContent.videoUrl || aboutContent.videoThumbnail) && (
        <div className="tsf-about tsf-bg-lightgreen relative py-20">
          <div className="w-full md:max-w-5xl mx-auto flex justify-center">
            <VideoPlayer
              src={aboutContent.videoUrl || '/images/video.mp4'}
              thumbnail={aboutContent.videoThumbnail || '/images/bg-about.webp'}
              thumbnailAlt={aboutContent.videoThumbnailAlt || 'About Three Star Foods'}
              className="w-full"
            />
          </div>
        </div>
      )}

      {stats.length > 0 && (
        <div className="tsf-about-video relative py-40 tsf-bg-secondary">
          <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
            <div className={`grid gap-10 ${stats.length === 1 ? 'grid-cols-1' : stats.length === 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : stats.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    className="tsf-font-sora text-6xl font-bold text-white block"
                  />
                  <p className="tsf-font-sora text-xl text-white mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(aboutContent.whoWeAreHeading || aboutContent.whoWeAreContent) && (
        <div className="tsf-about relative py-20 overflow-hidden">
          {/* Floating food items */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Chicken */}
            <div className="absolute top-10 left-10 w-20 h-20 opacity-20 animate-float">
              <div className="text-6xl">🍗</div>
            </div>
            {/* Burger */}
            <div className="absolute top-32 right-20 w-16 h-16 opacity-20 animate-float-delayed">
              <div className="text-5xl">🍔</div>
            </div>
            {/* Fish */}
            <div className="absolute bottom-20 left-20 w-16 h-16 opacity-20 animate-float-slow">
              <div className="text-5xl">🐟</div>
            </div>
            {/* Meat */}
            <div className="absolute top-1/2 right-10 w-20 h-20 opacity-20 animate-float">
              <div className="text-6xl">🥩</div>
            </div>
            {/* Sausage */}
            <div className="absolute bottom-32 right-32 w-14 h-14 opacity-20 animate-float-delayed">
              <div className="text-4xl">🌭</div>
            </div>
            {/* Bacon */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 opacity-20 animate-float-slow">
              <div className="text-5xl">🥓</div>
            </div>
            {/* Drumstick */}
            <div className="absolute bottom-10 right-1/4 w-18 h-18 opacity-20 animate-float">
              <div className="text-5xl">🍗</div>
            </div>
          </div>

          <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="tsf-about-content text-center">
                {aboutContent.whoWeAreHeading && (
                  <h2 className="tsf-font-sora text-4xl font-bold uppercase mb-8">{aboutContent.whoWeAreHeading}</h2>
                )}
                {aboutContent.whoWeAreContent && (
                  <p className="tsf-font-sora text-xl/8 max-w-3xl mx-auto">
                    {aboutContent.whoWeAreContent.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < aboutContent.whoWeAreContent!.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {(aboutContent.whyChooseUsHeading || aboutContent.whyChooseUsDescription || aboutContent.whyChooseUsTeamImage || features.length > 0) && (
        <div className="tsf-choose-us tsf-bg-secondary relative py-20">
          <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
            <div className="grid grid-cols-2 gap-10">
              <div className="col-span-1">
                <div className="tsf-choose-us-content">
                  {aboutContent.whyChooseUsHeading && (
                    <h2 className="tsf-font-sora text-4xl font-bold uppercase text-white">{aboutContent.whyChooseUsHeading}</h2>
                  )}
                  {aboutContent.whyChooseUsDescription && (
                    <p className="tsf-font-sora mt-5 text-xl/8 text-white">{aboutContent.whyChooseUsDescription}</p>
                  )}
                  {aboutContent.whyChooseUsTeamImage && (
                    <div className="relative w-full pt-10">
                      <div className="relative w-full bg-gradient-to-br from-white/10 to-white/5 rounded-xl tsf-box-shadow hover:shadow-xl transition-all duration-300">
                        <div className="relative w-full rounded-lg overflow-hidden border-4 border-white/20 shadow-inner">
                          <Image
                            src={aboutContent.whyChooseUsTeamImage}
                            alt="Our Team"
                            width={800}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority={false}
                          />
                        </div>
                        {/* Decorative corner accents */}
                        <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-white/60 rounded-tl-lg"></div>
                        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-white/60 rounded-br-lg"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {features.length > 0 && (
                <div className="col-span-1">
                  <div className="tsf-choose-us-content space-y-4">
                    {features.map((feature, index) => {
                      const isEven = index % 2 === 0;
                      return (
                        <div
                          key={index}
                          className={`relative group tsf-bg-red tsf-box-shadow flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${isEven ? 'ml-0' : 'ml-4'
                            }`}
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          {/* Number badge */}
                          <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                            <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                          </div>

                          {/* Icon container with background */}
                          {feature.icon && (
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center p-1.5 group-hover:bg-white/30 transition-colors">
                              <Image
                                src={feature.icon}
                                className="object-contain"
                                alt={feature.title}
                                width={32}
                                height={32}
                              />
                            </div>
                          )}

                          {/* Text content */}
                          <div className="flex-1">
                            <h4 className="tsf-font-sora text-base font-bold uppercase text-white leading-tight group-hover:text-white/90 transition-colors">
                              {feature.title}
                            </h4>
                          </div>

                          {/* Hover arrow indicator */}
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-white"
                            >
                              <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>

                          {/* Decorative gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DynamicFAQ />

      <Footer />
    </CartProvider>
  );
}

