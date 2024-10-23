import { redirect } from 'next/navigation';

const YeeterHome = () => {
  redirect('/step/recipients');
  return null;
};

export default YeeterHome;
