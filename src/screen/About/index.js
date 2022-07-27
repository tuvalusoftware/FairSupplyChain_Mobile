/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Image, Text, ScrollView, useTheme} from 'native-base';
import logo from '../../images/logo.png';
import {Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Index(props) {
  const {colors} = useTheme();
  return (
    <ScrollView>
      <Box p="12px">
        <Box justifyContent="center" alignItems="center">
          <Image source={logo} alt="logo" h="100px" resizeMode="contain" />
          <Text bold mt="12px">
            Fuixlabs Wallet 1.0.2
          </Text>
        </Box>
        <Text fontSize="18px" bold mt="32px">
          About Project{' '}
        </Text>
        <Box bg="white" mt="22px" p="16px" borderRadius="8px">
          <Text fontSize="10px">
            Project Catalyst - F7: Accelerate Decentralized Identity
          </Text>
          <Text bold fontSize="18px" mb="12px">
            Fair Supply Chain In Ghana
          </Text>
          <Text>
            This project will document a governance model for a last mile supply
            chain management system that is flexible enough to serve both local
            spot markets and wider markets. {'\n'} {'\n'}After completion the
            project will deliver (i) a whitepaper, (ii) A technology framework
            that can be easily copied to support multiple markets, and (iii) a
            proof-of-consept that provides a concrete example of that our model
            being successfully on small holder farms in Ghana.{'\n'}
            {'\n'} In a project we started using from Fund 5, we are building a
            last-mile supply chain that connects small size farms in Ghana with
            buyers - see project web page here:
            www.cardanonocode.com/hackathon-detail.htm.{'\n'} {'\n'}The project
            is intended to fill the void of supply chain management systems
            (SCMs) that address the challenge of providing food provenance while
            imposing minimal disruption of existing processes and meta-data
            standards adoption. The project is also a laboratory for testing new
            ideas and includes risk mitigation for participating farmers so
            risks are absorbed by us not the participating small farmers.{'\n'}
            {'\n'} Last-mile supply chains can be disruptive to local spot
            markets which help regulate prices by providing bargaining power to
            the small farme.{'\n'}
            {'\n'} While building this last-mile supply chain, it occurred to us
            that we are introducing a potentially harmful side effect: By making
            new markets available through accessible supply chains, we can
            potentially reduce the competitive leverage provided by local spot
            markets.
          </Text>
          <Text
            onPress={() =>
              Linking.openURL('https://fuixlabs.com/supply-chain-in-ghana.html')
            }
            color="primary.500"
            textAlign="center"
            mt="22px">
            Lear more{' '}
            <MaterialCommunityIcons
              name="open-in-new"
              size={20}
              color={colors.primary[500]}
            />
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}
