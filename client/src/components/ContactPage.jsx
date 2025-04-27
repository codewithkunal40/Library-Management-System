const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Contact Us</h1>
      <p className="text-gray-700 max-w-2xl mb-6">
        Have questions, feedback, or need help? We're here for you!
        <br />
        <br />
        📧 Email: support@librarysystem.com <br />
        ☎️ Phone: +91 98765 43210
      </p>
      <p className="text-gray-700 text-sm">
        We usually respond within 24 hours.
      </p>
    </div>
  );
};

export default ContactPage;
