import { redirect } from 'next/navigation';

const YeeterHome = () => {
  redirect('/steps/recipients');
  return null;
};

export default YeeterHome;
