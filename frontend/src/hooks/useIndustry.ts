import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useIndustry = () => {
  const industry = useSelector((state: RootState) => state.auth.industry);

  const isProducer = industry?.industry_type !== 'Landfill';
  const isConsumer = true; // All industries can be consumers

  return {
    industry,
    isProducer,
    isConsumer,
  };
};