import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FAQAccordion from '../../components/FAQAccordion';
import { CartProvider } from '../../context/CartContext';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <CartProvider>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="container mx-auto px-10">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora">Contact Us</h1>
          </div>
        </div>
      </div>

      <div className="tsf-contact relative py-20">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-3">
            <div className="tsf-contact-detail rounded-tl-md rounded-bl-md tsf-bg-secondary p-10">
              <span className="uppercase text-white pb-5 inline-block">contact us</span>
              <h2 className="text-4xl text-white text-align-center font-extrabold tsf-font-sora">Let&apos;s build Together</h2>
              <div className="detail-list pt-8">
                <div className="detail-list-item pb-5">
                  <div className="flex items-center">
                    <div className="detail-img p-5 bg-white rounded-full"><Image src="/design/src/assets/img/location.svg" alt="location" width={24} height={24} /></div>
                    <div className="detail-text pl-5"><p className="text-white line-height-10">Tokha-6, Kathmandu, Greenland,<br /> Triyog Marg</p></div>
                  </div>
                </div>
                <div className="detail-list-item pb-5">
                  <div className="flex items-center">
                    <div className="detail-img p-5 bg-white rounded-full"><Image src="/design/src/assets/img/call.svg" alt="call" width={24} height={24} /></div>
                    <div className="detail-text pl-5"><p className="text-white line-height-10">+977 14988879, 4963659</p></div>
                  </div>
                </div>
                <div className="detail-list-item">
                  <div className="flex items-center">
                    <div className="detail-img p-5 bg-white rounded-full"><Image src="/design/src/assets/img/email.svg" alt="email" width={24} height={24} /></div>
                    <div className="detail-text pl-5"><p className="text-white line-height-10">3starmeat@gmail.com</p></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tsf-contact-form col-span-2 rounded-tr-md rounded-br-md w-full tsf-bg-gray p-10 z-10">
              <form className="pt-8" action="">
                <input className="bg-white rounded-full w-full mb-6 py-4 px-6" type="text" placeholder="Name" />
                <input className="bg-white rounded-full w-full mb-6 py-4 px-6" type="email" placeholder="Email" />
                <input className="bg-white rounded-full w-full mb-6 py-4 px-6" type="text" placeholder="Subject" />
                <textarea className="bg-white rounded-lg w-full mb-6 py-4 px-6" rows={10} placeholder="Message"></textarea>
                <button className="tsf-button cursor-pointer" type="submit">Submit</button>
              </form>
            </div>
          </div>
          <div className="contact-map pt-20">
            <iframe className="rounded-md" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4560.946311392599!2d85.3271149!3d27.7464399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19660f4fdcab%3A0xab7cb8e2621a0e16!2s3%20Star%20Meat%20Products!5e1!3m2!1sen!2snp!4v1758604799250!5m2!1sen!2snp" width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>

      <FAQAccordion />

      <Footer />
    </CartProvider>
  );
}
