// The 64 districts, Dhaka first (delivery is priced inside / outside Dhaka).
export const DISTRICTS = ['Dhaka', 'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria', 'Chandpur', 'Chapai Nawabganj', 'Chattogram', 'Chuadanga', "Cox's Bazar", 'Cumilla', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 'Jashore', 'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachhari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon']

export const GATEWAYS = {
  cod: { label: 'Cash on delivery', hint: 'Pay the courier when your parcel arrives.', icon: 'lucide:banknote' },
  bkash: { label: 'bKash', hint: 'Pay now with your bKash account.', icon: 'lucide:smartphone' },
  portpos: { label: 'Card / mobile banking', hint: 'Visa, Mastercard, Nagad and more via PortPos.', icon: 'lucide:credit-card' },
}

export const ORDER_STATUS = {
  PENDING: { label: 'Awaiting payment', tone: 'bg-cream-deep text-ink' },
  PAYMENT_INITIATED: { label: 'Awaiting payment', tone: 'bg-cream-deep text-ink' },
  PAYMENT_FAILED: { label: 'Payment failed', tone: 'bg-sale/10 text-sale' },
  PROCESSING: { label: 'Confirmed', tone: 'bg-gold/20 text-gold-deep' },
  ON_SHIPPING: { label: 'On the way', tone: 'bg-gold/20 text-gold-deep' },
  DELIVERED: { label: 'Delivered', tone: 'bg-green-100 text-green-800' },
  RETURNED: { label: 'Returned', tone: 'bg-sale/10 text-sale' },
  CANCELLED: { label: 'Cancelled', tone: 'bg-cream-deep text-ink-soft' },
}
