import { makeRelativeLink } from '@/utils/functions/functions';
import Link from 'next/link';

const BreadCrumbs = ({ breadCrumbs }: any) => {
  return (
    <div className="flex gap-3 items-center text-xs leading-general font-bold flex-wrap">
      {breadCrumbs?.map((crumb: any, key: number) => {
        if (breadCrumbs.length - 1 === key) {
          return (
            <div key={key}>
              <span>{crumb.text}</span>
            </div>
          );
        }
        return (
          <div
            key={key}
            className="flex gap-3 items-center text-breadcrumb-grey"
          >
            <Link
              className="hover:text-primary duration-300"
              href={makeRelativeLink(crumb.url)}
            >
              {crumb.text}
            </Link>
            <BreadCrumbArrow />
          </div>
        );
      })}
    </div>
  );
};

export default BreadCrumbs;

export const BreadCrumbArrow = () => {
  return (
    <svg
      width="5"
      height="9"
      viewBox="0 0 5 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.01501 4.08504L0.167372 7.99978L0.983071 8.82971L4.8307 4.91496L4.01501 4.08504ZM0.167372 1.00022L4.01501 4.91496L4.8307 4.08504L0.983071 0.170291L0.167372 1.00022ZM0.167372 7.99978C-0.0557904 8.22684 -0.0557904 8.60265 0.167372 8.82971C0.390535 9.05676 0.759908 9.05676 0.983071 8.82971L0.167372 7.99978ZM4.42286 4.5L4.8307 4.91496C4.93844 4.80535 5 4.65659 5 4.5C5 4.34341 4.93844 4.19465 4.8307 4.08504L4.42286 4.5ZM0.983071 0.170291C0.759908 -0.0567638 0.390535 -0.0567638 0.167372 0.170291C-0.0557904 0.397347 -0.0557904 0.773162 0.167372 1.00022L0.983071 0.170291Z"
        fill="currentColor"
      />
    </svg>
  );
};
