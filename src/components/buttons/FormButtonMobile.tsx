import SlideToTrade from './SlideToTrade'
import TapToApproveButton from './TapToApproveButton'
import { TradeType } from '../../index'

interface FormButtonMobileProps {
  isTokenApproved: boolean
  quoteNeeded: boolean
  disabled: boolean
  onVerify: () => void
  onRefreshQuote: () => void
  onApprove: (e: any) => void
  type: TradeType
}

const FormButtonMobile = ({
  isTokenApproved,
  quoteNeeded,
  disabled,
  onVerify,
  onRefreshQuote,
  onApprove,
  type,
}: FormButtonMobileProps) => {
  if (isTokenApproved && !quoteNeeded) {
    return <SlideToTrade tradeType={type} disabled={disabled} onSuccess={onVerify} />
  }

  if (!isTokenApproved) {
    return <TapToApproveButton tradeType={type} disabled={disabled} onClick={onApprove} />
  }

  return (
    <TapToApproveButton
      tradeType={type}
      disabled={disabled}
      onClick={onRefreshQuote}
      text="Tap to Refresh Quote"
    />
  )
}

export default FormButtonMobile
