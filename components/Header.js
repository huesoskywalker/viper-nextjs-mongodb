import headerStyles from '../styles/Header.module.css'

const Header = () => {
  return (
    <div>
      <h1 className={headerStyles.title}>
        <span>viper</span>
      </h1>
      <p className={headerStyles.description}>
        Keep up to date with the latest events 
      </p>
    </div>
  )
}

export default Header