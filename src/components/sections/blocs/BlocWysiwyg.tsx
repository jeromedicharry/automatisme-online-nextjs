import { BlocWysiWygProps } from '@/types/blocTypes';
import Container from '../../container';
// import { Fade } from "react-awesome-reveal";

const BlocWysiwyg = ({ bloc }: { bloc: BlocWysiWygProps }) => {
  if (!bloc) return null;
  // todo internal style wysiwyg
  return (
    <section className=" mb-16 md:mb-[104px]">
      <Container>
        {/* <Fade cascade triggerOnce damping={0.15}> */}
        <div
          className="wysiwyg post-content"
          dangerouslySetInnerHTML={{
            __html: bloc?.text,
          }}
        />
        {/* </Fade> */}
      </Container>
    </section>
  );
};

export default BlocWysiwyg;
