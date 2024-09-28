import { useAuth } from 'src/hooks/useAuth'

const navigation = () => {
  const { userMenu } = useAuth()
  const userm=[{title:"Dashboard",path:'/home'},{title:"Physical Verification",path:'/physical-verification'}]
  return Object.keys(userm).map((i) => (userm[i]));
}

export default navigation
