import { mediaUrl } from "@/lib/mediaUrl";
import BidModal from "@/features/shared/components/BidModal";

interface BidModalWrapperProps {
  show: boolean;
  property: any;
  bidAmount: string;
  bidSuccess: boolean;
  isPending: boolean;
  onClose: () => void;
  onBidChange: (val: string) => void;
  onSubmit: () => void;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

const getPropertyImage = (property: any) => {
  if (property?.media?.propertyImages?.length > 0) {
    return mediaUrl(property.media.propertyImages[0]);
  }
  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600";
};

export default function BidModalWrapper({ show, property, bidAmount, bidSuccess, isPending, onClose, onBidChange, onSubmit }: BidModalWrapperProps) {
  const currentBid = property?.currentBid || property?.pricing?.startingAuctionPrice || 0;
  const bidIncrement = property?.pricing?.minimumBidIncrement || 1000;
  const nextMinBid = currentBid + bidIncrement;

  return (
    <BidModal
      show={show}
      onClose={onClose}
      property={property}
      currentBid={currentBid}
      nextMinBid={nextMinBid}
      bidIncrement={bidIncrement}
      bidAmount={bidAmount}
      onBidAmountChange={onBidChange}
      bidSuccess={bidSuccess}
      isPending={isPending}
      onSubmit={onSubmit}
      formatPrice={formatPrice}
      getPropertyImage={getPropertyImage}
    />
  );
}
