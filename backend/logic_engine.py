"""Form logic engine for evaluating conditional rules."""

from typing import Dict, Any, List, Set
from schemas import LogicRule, LogicCondition, LogicAction


class LogicEngine:
    """Evaluates form logic rules based on form responses."""

    @staticmethod
    def evaluate_condition(condition: LogicCondition, responses: Dict[str, Any]) -> bool:
        """Evaluate a single condition."""
        field_value = responses.get(condition.field_id)

        if condition.operator == "equals":
            if isinstance(field_value, list):
                return condition.value in field_value
            return field_value == condition.value

        elif condition.operator == "not_equals":
            if isinstance(field_value, list):
                return condition.value not in field_value
            return field_value != condition.value

        elif condition.operator == "contains":
            if isinstance(field_value, str):
                return str(condition.value).lower() in field_value.lower()
            if isinstance(field_value, list):
                return condition.value in field_value
            return False

        elif condition.operator == "is_selected":
            if isinstance(field_value, list):
                return condition.value in field_value
            return field_value == condition.value

        elif condition.operator == "matches_regex":
            import re
            if isinstance(field_value, str) and condition.value:
                try:
                    return bool(re.search(condition.value, field_value))
                except re.error:
                    return False
            return False

        elif condition.operator == "is_empty":
            return field_value is None or field_value == "" or field_value == [] or field_value == {}

        elif condition.operator == "is_not_empty":
            empty = field_value is None or field_value == "" or field_value == [] or field_value == {}
            return not empty


        elif condition.operator == "greater_than":
            try:
                return float(field_value) > float(condition.value)
            except (ValueError, TypeError):
                return False

        elif condition.operator == "less_than":
            try:
                return float(field_value) < float(condition.value)
            except (ValueError, TypeError):
                return False

        elif condition.operator == "in_list":
            if isinstance(condition.value, list):
                return field_value in condition.value
            return False

        return False

    @staticmethod
    def evaluate_conditions(
        conditions: List[LogicCondition],
        condition_type: str,
        responses: Dict[str, Any],
    ) -> bool:
        """Evaluate multiple conditions with AND/OR logic."""
        if not conditions:
            return True

        results = [
            LogicEngine.evaluate_condition(cond, responses) for cond in conditions
        ]

        if condition_type == "all":
            return all(results)
        elif condition_type == "any":
            return any(results)
        return True

    @staticmethod
    def evaluate_rule(rule: LogicRule, responses: Dict[str, Any]) -> List[LogicAction]:
        """Evaluate a rule and return actions if conditions are met."""
        if LogicEngine.evaluate_conditions(
            rule.conditions, rule.condition_type, responses
        ):
            return rule.actions
        return []

    @staticmethod
    def evaluate_all_rules(
        rules: List[LogicRule], responses: Dict[str, Any]
    ) -> Dict[str, List[LogicAction]]:
        """Evaluate all rules and return mapping of field_id to actions."""
        field_actions: Dict[str, List[LogicAction]] = {}

        for rule in rules:
            actions = LogicEngine.evaluate_rule(rule, responses)
            for action in actions:
                if action.field_id not in field_actions:
                    field_actions[action.field_id] = []
                field_actions[action.field_id].append(action)

        return field_actions

    @staticmethod
    def get_visible_fields(
        rules: List[LogicRule], responses: Dict[str, Any], all_field_ids: Set[str]
    ) -> Set[str]:
        """Determine which fields should be visible based on logic rules."""
        visible_fields = set(all_field_ids)

        field_actions = LogicEngine.evaluate_all_rules(rules, responses)

        for field_id, actions in field_actions.items():
            for action in actions:
                if action.action == "hide":
                    visible_fields.discard(field_id)
                elif action.action == "show":
                    visible_fields.add(field_id)

        return visible_fields

    @staticmethod
    def get_required_fields(
        rules: List[LogicRule], responses: Dict[str, Any], base_required: Set[str]
    ) -> Set[str]:
        """Determine which fields are required based on logic rules."""
        required_fields = set(base_required)

        field_actions = LogicEngine.evaluate_all_rules(rules, responses)

        for field_id, actions in field_actions.items():
            for action in actions:
                if action.action == "require":
                    required_fields.add(field_id)
                elif action.action == "unrequire":
                    required_fields.discard(field_id)

        return required_fields

    @staticmethod
    def get_field_styles(
        rules: List[LogicRule], responses: Dict[str, Any]
    ) -> Dict[str, Dict[str, Any]]:
        """Determine CSS styles for fields based on logic rules."""
        field_styles: Dict[str, Dict[str, Any]] = {}

        field_actions = LogicEngine.evaluate_all_rules(rules, responses)

        for field_id, actions in field_actions.items():
            for action in actions:
                if action.action == "style" and action.value:
                    if field_id not in field_styles:
                        field_styles[field_id] = {}
                    field_styles[field_id].update(action.value)

        return field_styles
