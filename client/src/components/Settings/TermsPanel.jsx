//This is the panel in our project that displays our applications terms in the settings page

export default function TermsPanel() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold tracking-tight">Terms of Service</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Our Terms and Conditions were last updated on 04/14/26.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-700">
        <p>
          Please read these terms and conditions carefully before using our service.
        </p>

        <p className="mt-4">
          When you create an account with us, you must provide information that is
          accurate, complete, and current at all times. Failure to do so
          constitutes a breach of the terms, which may result in immediate
          termination of your account on our service.
        </p>

        <p className="mt-4">
          You are responsible for safeguarding the password that you use to access
          the service and for any activities or actions under your password,
          whether your password is with our service or a third-party social media
          service.
        </p>

        <p className="mt-4">
          You agree not to disclose your password to any third party. You must
          notify us immediately upon becoming aware of any breach of security or
          unauthorized use of your account.
        </p>

        <p className="mt-4">
          You may not use as a username the name of another person or entity, a
          name or trademark that is subject to any rights of another person or
          entity other than you without appropriate authorization, or a name that
          is otherwise offensive, vulgar, or obscene.
        </p>
      </section>
    </div>
  );
}