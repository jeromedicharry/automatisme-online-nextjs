import { BlocWysiWygProps } from '@/types/blocTypes';
import Container from '../../container';
import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import ExpandableText from '@/components/atoms/ExpandableText';
// import { Fade } from "react-awesome-reveal";

const BlocWysiwyg = ({ bloc }: { bloc: BlocWysiWygProps }) => {
  if (!bloc) return null;
  // todo internal style wysiwyg
  return (
    <section className=" mb-16 md:mb-[104px]">
      <Container>
        {/* <Fade cascade triggerOnce damping={0.15}> */}
        <BlocIntroSmall title={bloc.title} subtitle={bloc.subtitle} />
        <ExpandableText text={bloc.text} />
        {/* </Fade> */}
      </Container>
    </section>
  );
};

export default BlocWysiwyg;
