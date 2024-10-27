import ConfirmationButtonMenu from '../components/menu/ConfirmationButtonMenu';
import PageTemplate, { PageTemplateParam } from './PageTemplate';

interface ConfirmationPageParams extends PageTemplateParam {
  onAccept: () => void;
  acceptDisabled?: boolean;
}

function ConfirmationPage({ onAccept, acceptDisabled, children, ...rest }: ConfirmationPageParams) {
  return (
    <PageTemplate
      {...rest}
      bottom={<ConfirmationButtonMenu acceptDisabled={acceptDisabled} onAccept={onAccept} />}
    >
      {children}
    </PageTemplate>
  );
}

export default ConfirmationPage;
