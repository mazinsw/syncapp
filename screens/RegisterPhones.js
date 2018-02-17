import React, { Component } from 'react';
import { Keyboard, View } from 'react-native';
import { Container, Header, Body, Left, Button, Icon, Title, Form, Item, Input, Label, Content, Text, Right } from 'native-base';

// SQLite configuration
import SQLite from 'react-native-sqlite-storage';

// Library for events manipulation
import Events from '../utils/events';

/**
 * 
 * @class RegisterPhonesScreen
 * @extends Component
 * @description Represents the screen to register a phone for a specific customer.
 */
export default class RegisterPhonesScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = props.navigation.state;
        this.state = {
            customer: params.customer,
            phone: ''
        };
    }

    /**
     * 
     * @method RegisterPhonesScreen#insert
     * @description Method that inserts a phone into the database.
     */
    insert() {
        let props = this.props;
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.executeSql('INSERT INTO phone(customer_id, number) VALUES(?, ?);', [this.state.customer.id, this.state.phone]);
        Events.publish('RefreshNumbers');
        props.navigation.goBack();
    }

    errorCB(err) {
        console.error("SQLite3 Error: " + err);
    }

    openCB() {
        console.log("Database OPENED");
    }

    render() {
        let props = this.props;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.customer.name}</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel last>
                            <Label>Telefone</Label>
                            <Input onChangeText={(phone) => this.setState({ phone })} />
                        </Item>
                    </Form>
                    <View style={{ margin: 15 }}>
                        <Button
                            full
                            danger
                            onPress={
                                () => {
                                    Keyboard.dismiss();
                                    this.insert();
                                }
                            }
                        >
                            <Text>Cadastrar</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}