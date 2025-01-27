import CardQuestionCta from '@/components/cards/CardQuestionCta';
import Container from '@/components/container';
import { BlocQuestionsProps } from '@/types/blocTypes';

const BlocQuestions = ({ bloc }: { bloc: BlocQuestionsProps }) => {
  if (!bloc) return null;
  if (!bloc.ctas || bloc.ctas.length === 0) return null;

  return (
    <Container>
      <section className="mb-12 md:mb-16 flex lg:flex-row flex-col justify-between gap-5 w-fit mx-auto">
        {bloc.ctas.map((cta, index) => (
          <CardQuestionCta key={index} question={cta} />
        ))}
      </section>
    </Container>
  );
};

export default BlocQuestions;
