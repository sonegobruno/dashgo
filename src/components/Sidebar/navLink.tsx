import { Icon, Link as ChakraLink, Text, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import React, { ElementType } from "react";
import Link from 'next/link';
import { ActiveLink } from "../ActiveLinks";

interface NavLiveProps extends ChakraLinkProps{
    icon: ElementType;
    children: string;
    href: string;
}

export function NavLink({children, icon, href, ...rest}: NavLiveProps) {
    return(
        <ActiveLink href={href} passHref>
            <ChakraLink display="flex" alignItems="center" color="pink.400" {...rest}>
                <Icon as={icon} fontSize="20"/>
                <Text ml="4" fontWeight="medium">{children}</Text>
            </ChakraLink>
        </ActiveLink>
    )
}