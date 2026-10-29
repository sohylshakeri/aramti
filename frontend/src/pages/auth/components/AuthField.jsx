export default function AuthField({
  icon,
  className = '',
  inputClassName = '',
  ...inputProps
}) {
  return (
    <label className={`auth-field ${className}`.trim()}>
      {icon && <img className="auth-field__icon" src={icon} alt="" />}
      <input
        className={`auth-field__input ${inputClassName}`.trim()}
        {...inputProps}
      />
    </label>
  )
}
