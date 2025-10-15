import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FAQAccordion from '../../components/FAQAccordion';

export default function AboutPage() {
  return (
    <>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="container mx-auto">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora capitalize">about</h1>
          </div>
        </div>
      </div>

      <FAQAccordion />

      <Footer />
    </>
  );
}


