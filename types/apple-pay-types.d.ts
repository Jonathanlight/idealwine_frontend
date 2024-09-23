// We import Apple Pay SDK as a script, but it does not contain any types. We add here the custom html element it contains.
declare namespace JSX {
  interface IntrinsicElements {
    "apple-pay-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        buttonstyle?: string;
        type?: string;
        locale?: string;
        onclick?: string;
      },
      HTMLElement
    >;
  }
}

interface CompletableEvent extends Event {
  complete(Promise): void;
}

// This structure is specific to Apple Pay PaymentResponse, do not use in other contexts
interface ApplePayPaymentResponse extends PaymentResponse {
  details: {
    token: {
      paymentData: {
        version: string;
        data: string;
        signature: string;
        header: {
          ephemeralPublicKey: string;
          publicKeyHash: string;
          transactionId: string;
        };
      };
      paymentMethod: {
        displayName: string;
        network: string;
        type: string;
      };
      transactionIdentifier: string;
    };
  };
}

interface PaymentRequest extends EventTarget {
  onmerchantvalidation?: (event: CompletableEvent) => void;
  show(): Promise<ApplePayPaymentResponse>;
}
