import { Button, Code, Link, Separator, Text } from "@radix-ui/themes";
import { FiMail } from "react-icons/fi"
import PageContainer from "@/components/layout/Settings/PageContainer"
import SettingsContentContainer from "@/components/layout/Settings/SettingsContentContainer"
import SettingsPageHeader from "@/components/layout/Settings/SettingsPageHeader"
import { Stack } from "@/components/layout/Stack"
import SocketIOHealth from "@/components/feature/settings/help/SocketIOHealth"
import { getFlowSupportEmail } from "@/utils/flowBrand"

const HelpAndSupport = () => {
    const supportEmail = getFlowSupportEmail()

    return (
        <PageContainer>
            <SettingsContentContainer>
                <SettingsPageHeader
                    title='Help and Support'
                />

                <Stack gap="5">
                    <Stack>
                        <Text color="gray" size="2" as='span' className='font-medium'>Have ideas or ran into an issue?</Text>
                        <div>
                            <Button size="2" variant="outline" color='gray' className="not-cal cursor-pointer" asChild>
                                <Link href={`mailto:${supportEmail}`}><FiMail /> Contact FLOW Support</Link>
                            </Button>
                        </div>

                    </Stack>
                    <Separator size='4' />

                    <SocketIOHealth />
                    <Separator size='4' />

                    {supportEmail && <Link underline="always" size='2' color='gray' href={`mailto:${supportEmail}`}>
                        {supportEmail}
                    </Link>}


                    <Stack gap='0'>
                        {/* @ts-expect-error */}
                        <Text size='3' color='gray'><Text size='5' className="cal-sans text-gray-12 dark:text-white">FlowConnect</Text> <Code size='2' variant="ghost">v{frappe?.boot.versions.raven}</Code></Text>
                        <Text size='2' color='gray'>A FLOW product</Text>
                    </Stack>
                </Stack>

            </SettingsContentContainer>

        </PageContainer>
    )
}

export const Component = HelpAndSupport
