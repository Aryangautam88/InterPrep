import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';

export default function ComingSoon({ title, body }) {
  return (
    <Card>
      <EmptyState title={title} body={body || 'This module is scheduled for a later phase.'} />
    </Card>
  );
}
