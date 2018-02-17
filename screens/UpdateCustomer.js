import React, { Component } from 'react';
import { Keyboard, View } from 'react-native';
import { Container, Header, Body, Left, Button, Icon, Title, Form, Item, Input, Label, Text, Content, Right } from 'native-base';

// SQLite configuration
import SQLite from 'react-native-sqlite-storage';

// Library for events manipulation
import Events from '../utils/events';

/**
 * 
 * @class UpdateCustomerScreen
 * @extends Component
 * @description Represents the screen to update a customer.
 */
export default class UpdateCustomerScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = props.navigation.state;
        this.state = {
            customer: params.customer,
            name: params ? params.customer.name : null,
            code: params ? params.customer.code : null
        };
    }

    /**
     * 
     * @method UpdateCustomerScreen#update
     * @description Method that update some database customer.
     */
    update() {
        let props = this.props;
        let id = this.state.customer.id;
        let name = this.state.name;
        let code = this.state.code;
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.executeSql('UPDATE customer SET name = ?, code = ? WHERE id = ?;', [name, code, id]);
        Events.publish('RefreshCustomer');
        props.navigation.goBack();
    }

    errorCB(err) {
        console.error("SQLite3 Error: " + err);
    }

    openCB() {
        console.log("Database");
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
                        <Title>Atualizar</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel last>
                            <Label>Nome</Label>
                            <Input value={this.state.name} onChangeText={(name) => this.setState({ name })} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Código</Label>
                            <Input value={this.state.code} onChangeText={(code) => this.setState({ code })} />
                        </Item>
                    </Form>
                    <View style={{ margin: 15 }}>
                        <Button
                            full
                            danger
                            onPress={
                                () => {
                                    Keyboard.dismiss();
                                    this.update();
                                }
                            }
                        >
                            <Text>Atualizar</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}