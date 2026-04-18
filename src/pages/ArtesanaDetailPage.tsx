import { useParams, useNavigate } from 'react-router';
import { ArtesanaDetail } from '@/components/ArtesanaDetail';

export default function ArtesanaDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        navigate('/creadoras');
        return null;
    }

    return (
        <ArtesanaDetail
            artesanaId={id}
            onBack={() => navigate('/creadoras')}
        />
    );
}