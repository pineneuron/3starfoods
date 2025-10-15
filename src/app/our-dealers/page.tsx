import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DealersMap from '../../components/DealersMap';
import DealersList from '../../components/DealersList';

export default function OurDealersPage() {
  return (
    <>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="container mx-auto">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora capitalize">our dealers</h1>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-10">
          <div className="text-center mb-12">
            <h2 className="tsf-dark-color text-4xl font-bold mb-4">Find Our Dealers Near You</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We have authorized dealers across Nepal to serve you with the freshest meat products. 
              Use the map below to find the nearest dealer in your city.
            </p>
          </div>

          <div className="mb-16">
            <DealersMap />
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold tsf-font-sora text-gray-800 mb-8 text-center">All Dealers</h3>
            <DealersList />
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold tsf-font-sora text-gray-800 mb-4">Want to Become a Dealer?</h3>
            <p className="text-gray-600 mb-6">
              Join our network of authorized dealers and bring quality meat products to your community.
            </p>
            <button className="bg-red-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-700 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
