import classNames from 'classnames'

interface TapToApproveButtonProps {
  tradeType: string
  disabled: boolean
  onClick: (e: any) => void
  text?: string
}

const TapToApproveButton = ({ tradeType, disabled, onClick, text }: TapToApproveButtonProps) => (
  <button
    className={classNames(`button _${tradeType.toLowerCase()}`, 'negative')}
    disabled={disabled}
    onClick={onClick}>
    {text || 'Tap to Approve'}
  </button>
)

export default TapToApproveButton
