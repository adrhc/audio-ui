import ConfirmationButtonMenu from '../components/menu/ConfirmationButtonMenu';
import PageTemplate, { PageTemplateParam } from './PageTemplate';

interface ConfirmationPageTmplParam extends PageTemplateParam {
  onAccept: () => void;
  acceptDisabled?: boolean;
}

function ConfirmationPageTmpl({ onAccept, acceptDisabled, children, ...rest }: ConfirmationPageTmplParam) {
  return (
    <PageTemplate
      {...rest}
      bottom={<ConfirmationButtonMenu acceptDisabled={acceptDisabled} onAccept={onAccept} />}
    >
      {children}
    </PageTemplate>
  );
}

export default ConfirmationPageTmpl;
