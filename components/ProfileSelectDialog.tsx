'use client';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listAvailableLensAccounts, loginWithAccount } from '../lib/lensProtocolUtils';
import { AccountAvailable } from '@lens-protocol/client';
import { DialogTitle } from '@radix-ui/react-dialog';

interface ProfileSelectDialogProps {
    account: any; // Replace `any` with a specific type if possible
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ProfileSelectDialog: React.FC<ProfileSelectDialogProps> = ({
    account,
    open,
    onOpenChange,
}) => {
    const [managedProfiles, setManagedProfiles] = useState<AccountAvailable[] | null>(null);
    const [loadingProfiles, setLoadingProfiles] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLensAccounts = async () => {
            try {
                if (account) {
                        const result = await listAvailableLensAccounts(account);
                        if (result && result?.items) {
                            setManagedProfiles([...result.items]);
                        } else {
                            setManagedProfiles([]);
                        }
                        setLoadingProfiles(false);
                    }
            } catch (err) {
                console.error('Error fetching Lens accounts:', err);
                setError('Failed to load profiles. Please try again later.');
            } finally {
                setLoadingProfiles(false);
            }
        };

        fetchLensAccounts();
    }, [account]);

    const handleProfileClick = async (lensAccount: AccountAvailable) => {
        // Implement your login method here
        console.log('lensAccount:', lensAccount.account);
        const result = await loginWithAccount(account, lensAccount.account);
        console.log('result: ', result);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>Login</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Choose a Profile</DialogTitle>
                {loadingProfiles ? (
                    <div>Loading profiles...</div>
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : managedProfiles?.length === 0 ? (
                    <div className="flex flex-col items-center">
                        <p>No profiles found.</p>
                        <Link href="/profile/mint" passHref>
                            <DialogClose asChild>
                                <Button className="mt-4">Create New Profile</Button>
                            </DialogClose>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {managedProfiles && managedProfiles.map((lensAccount, index) => (
                            <Card
                                key={lensAccount.account?.address || index}
                                className="w-full text-left cursor-pointer hover:bg-gray-200"
                                onClick={() => handleProfileClick(lensAccount)}
                            >
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage
                                            src={lensAccount.account?.metadata?.picture || ''}
                                            alt={lensAccount.account?.username?.localName || 'Avatar'}
                                        />
                                        <AvatarFallback>
                                            {lensAccount.account?.username?.localName.charAt(0) || 'N/A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-bold">{lensAccount.account?.username?.localName || 'Unnamed Profile'}</h2>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ProfileSelectDialog;
